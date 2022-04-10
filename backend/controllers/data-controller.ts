import type { Request, Response } from 'express'
import type { row, parameters } from '../utils/types.js'
import knex from 'knex'
import busboy from 'busboy'
import { parse } from 'csv-parse'

import { dbConfig } from '../config/config.js'
import { isValidEntry, isValidQuery, isValidMonth } from '../utils/validator.js'

const query = knex(dbConfig)

// HELPER FUNCTIONS

function setQueryFilters(queryBuilder: any, params: parameters) {
  if (params) {
    if (params.name) {
      // If we have multiple filters (i.e. an array), we have to use the WHERE clause with the IN operator.
      Object.prototype.toString.call(params.name) === '[object Array]' ?
        queryBuilder.whereIn('farm_name', params.name) :
        queryBuilder.where('farm_name', params.name)
    }

    if (params.type) {
      Object.prototype.toString.call(params.type) === '[object Array]' ?
        queryBuilder.whereIn('entry_type', params.type) :
        queryBuilder.where('entry_type', params.type)
    }

    if (params.startDate) {
      params.endDate ?
        queryBuilder.whereBetween('date', [params.startDate, params.endDate]) :
        queryBuilder.where('date', '>', params.startDate)
    } else if (params.endDate) {
      queryBuilder.where('date', '<', params.endDate)
    }
  }
}

function insertData(data: row[], response: Response) {
  query('entries').insert(data)
    .then(r => response.status(201).json({command: JSON.stringify(r, null, "  "), status: 'success'}))
    .catch(err => response.status(500).json({error: err}))
}

function handleTextRequestData(request: Request, response: Response) {
  const body: any = []

  request
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      try {
        const parsedBody = JSON.parse(body)

        const validEntries = parsedBody.filter((entry: row) => isValidEntry(entry))

        return insertData(validEntries, response)
      } catch {
        return response.status(400).send("There was a problem with your request.")
      }
  })
}

function handleCsvRequestData(request: Request, response: Response) {
  let rows: row[] = []

  // Busboy is used to parse multipart content.
  const bb = busboy({ headers: request.headers })

  const parser = parse({
    delimiter: ',',
    max_record_size: 200,
    columns: ['farm_id', 'date', 'entry_type', 'read_value']
  })

  bb.on('file', (_name, file, _info) => {
    file.on('readable', () => {
      let data
      while ((data = file.read()) !== null) { parser.write(data) }
    })
    file.on('end', () => parser.end())
  })

  bb.on('finish', () => {
    parser.on('readable', () => {
      let data
      while ((data = parser.read()) !== null) {
          rows.push(data)
      }
    })
    parser.on('error', err => console.error(err.message))
    parser.on('end', async () => prepareCsvData(rows, response))
    parser.end()
  })

  request.pipe(bb)
}

async function prepareCsvData(rows: row[], response: Response) {
  let validEntries: row[] = []

  // Check if there's at least one data entry (0 being the header).
  if (!rows[1]) { return response.status(204).end() }
  
  // The field was called farm_id but data from csv include only names, so we use that.
  const farmName = rows[1].farm_id
  
  const found = await query('farms').select('id').where('farm_name', farmName)

  // Check if farm exists. If not, no inserting is done (wouldn't work anyway).
  // NOTE: We could also add the farm now. This depends on how the app is intended to work.
  if (!found[0]) {
    return response.status(200).json({error: {detail: 'Farm must be in the database first. Nothing was added.'}})
  }
  
  const foundId = found[0].id

  // Formatting and validating rows.
  rows.forEach(r => {
    if (r.farm_id !== farmName) { return }

    r.farm_id = foundId

    if (isValidEntry(r)) { validEntries.push(r) }
  })

  return validEntries === []
    ? response.status(200).json({error: {detail: 'The file did not contain any valid data.'}})
    : insertData(validEntries, response)
}

// CONTROLLER FUNCTIONS

export function listData(_: Request, response: Response) {
  query('entries')
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function listDataByPeriod(request: Request, response: Response) {
  // We create the basic query structure.
  let listQuery = query('entries')
  listQuery
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')

  // We validate the year (and month, if exists) and pass it as filters in the query.
  if (request.params.year.match(/^\d{4}$/)) {
    if (request.params.month) {
      if (isValidMonth(request.params.month)) {
        listQuery.whereRaw(`EXTRACT(MONTH FROM date) = ?`, [request.params.month])
      } else {
        return response.status(204).end()
      }
    }
    listQuery.whereRaw(`EXTRACT(YEAR FROM date) = ?`, [request.params.year])
  } else {
    return response.status(204).end()
  }

  return listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function listDataWithFilters(request: Request, response: Response) {
  let listQuery = query('entries')
  listQuery
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')

  // If the request contains query parameters, values should be valid or the query returns No Content.
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }
  
  return listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function listAverages(request: Request, response: Response) {
  let listQuery = query('entries')
  listQuery
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('farm_name', 'entry_type', query.raw('ROUND(AVG(read_value),2) AS average_value'))

  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }

  return listQuery
    .groupBy('farm_name', 'entry_type')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function listMinMaxValues(request: Request, response: Response) {
  let listQuery = query('entries')
  listQuery
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('farm_name', 'entry_type', query.raw('MAX(read_value) AS max_value'),
      query.raw('MIN(read_value) AS min_value'))
    .groupBy('farm_name', 'entry_type')

  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }

  return listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function listDataForCharts(request: Request, response: Response) {
  let listQuery = query('entries')
  listQuery
    .join('farms', 'entries.farm_id', 'farms.id')
    .select('date', 'farm_name', 'read_value')
  
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }
  
  return listQuery
    .orderBy('date')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function saveData(request: Request, response: Response) {
  const contentType = request.headers['content-type']

  if (contentType?.includes('multipart/form-data')) {
    return handleCsvRequestData(request, response)
  } else if (contentType === 'application/json' || contentType === 'text/plain') {
    return handleTextRequestData(request, response)
  } else {
    return response.status(400).send("There was a problem with your request.")
  }
}
