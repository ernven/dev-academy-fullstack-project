import knex from 'knex'
import busboy from 'busboy'

import { dbConfig } from '../config/config.js'
import { isValidEntry, isValidQuery, isValidMonth } from '../utils/validator.js'

const query = knex(dbConfig)

// This -helper- function sets additional filter to the DB query.
function setQueryFilters(queryBuilder, params) {
  if (params) {
    // If present, filter by type(s).
    if (params.name) {
      // If we have multiple filters (i.e. an array), we have to use the WHERE clause with the IN operator.
      Object.prototype.toString.call(params.name) === '[object Array]' ?
        queryBuilder.whereIn('farm_name', params.name) :
        queryBuilder.where('farm_name', params.name)
    }

    // If present, filter by type(s).
    if (params.type) {
      // If we have multiple filters (i.e. an array), we have to use the WHERE clause with the IN operator.
      Object.prototype.toString.call(params.type) === '[object Array]' ?
        queryBuilder.whereIn('entry_type', params.type) :
        queryBuilder.where('entry_type', params.type)
    }

    // If present, filter by date(s).
    if (params.startDate) {
      params.endDate ?
        queryBuilder.whereBetween('date', [params.startDate, params.endDate]) :
        queryBuilder.where('date', '>', params.startDate)
    } else if (params.endDate) {
      queryBuilder.where('date', '<', params.endDate)
    }
  }
}

// This helper function inserts the data into the db.
function insertData(data, response) {
  query('entry').insert(data)
    .then(r => response.status(201).json({command: r.command, status: 'success'}))
    .catch(err => response.status(500).json({error: err}))
}

// This helper function handles the parsing of JSON from the request body. Then sends it for insert into the db.
function prepareDataFromText(request, response) {
  const body = []

  // If the request body is in text/JSON form, it is manually parsed (not using libraries).
  request
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      try {
        const parsedBody = JSON.parse(body)

        // Iterating through the request body and validating the items using our validator.
        const validEntries = parsedBody.filter(entry => isValidEntry(entry))

        // Finally, we insert the entries into the db.
        insertData(validEntries, response)
      } catch {
        return response.status(400).send("There was a problem with your request.")
      }
  })
}

// This helper function handles the parsing of the csv file and formatting of the data. Then sends it for insert.
function prepareDataFromCsv(request, response) {

  // Busboy is used to parse multipart content.
  const bb = busboy({ headers: request.headers })
  let body
  let rows = []

  bb
    .on('file', (_name, file, _info) => {
      file
        .on('data', data => body = data)
        .on('end', () => rows = body.toString().split('\n'))
    })
    .on('finish', () => {
      // Check if there's at least one data entry (0 being the header).
      if (!rows[1]) { return response.status(204).end() }
          
      // We need the farm ID for inserting.
      // Since data comes from a farm, should be the same for all (we can validate that later).
      const farmName = rows[1].split(',')[0]
      
      query('farm').select('id').where('farm_name', farmName)
        .then(found => {
          // Check if farm exists. If not, no inserting is done (wouldn't work anyway).
          // NOTE: We could also add the farm now. This depends on how the app is intended to work.
          if (!found[0]) {
            return response.status(400).json({error: {detail: 'Farm must be in the database first. Nothing was added.'}})
          }

          let validEntries = []

          // Formatting and validating rows. If all good, we add them to the array to be inserted.
          rows.forEach(r => {
            const fields = r.split(',')

            // Double check the farm name is the same!
            if (fields[0] === farmName) {
              const entry = { farm_id: found[0].id, date: fields[1], entry_type: fields[2], read_value: fields[3] } 

              if (isValidEntry(entry)) { validEntries.push(entry) }
            }
          })

          // Finally, we insert the entries into the db.
          insertData(validEntries, response)
        })
    })
  request.pipe(bb)
}

// This function gets all Farms' data from the DB.
export function listData(_, response) {
  query('entry')
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function gets all Farms' data from the DB.
export function listDataByPeriod(request, response) {
  // We create the basic query structure.
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
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

  // We use promises to deal with our query returns.
  listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function gets Farms' data from the DB (filtered with request parameters).
export function listDataWithFilters(request, response) {
  // We create the basic query structure.
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')

  // If the request contains query parameters, values should be valid or the query returns No Content.
  // If they are valid, we use .modify to handle optional parameters (using the helper function).
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }
  
  // We use promises to deal with our query returns.
  listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function returns averages of each type, for a certain farm.
export function listAverages(_, response) {
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('farm_name', 'entry_type', query.raw('ROUND(AVG(read_value),2) AS average_value'))

  // If the request contains query parameters, values should be valid or the query returns No Content.
  // If they are valid, we use .modify to handle optional parameters (using the helper function).
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }

  listQuery
    .groupBy('farm_name', 'entry_type')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function returns min and max values of each type, for a certain farm.
export function listMinMaxValues(request, response) {
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('farm_name', 'entry_type', query.raw('MAX(read_value) AS max_value'),
      query.raw('MIN(read_value) AS min_value'))
    .groupBy('farm_name', 'entry_type')

  // If the request contains query parameters, values should be valid or the query returns No Content.
  // If they are valid, we use .modify to handle optional parameters (using the helper function).
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }

  listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function returns data in a format best suited for drawing charts.
export function listDataForCharts(request, response) {
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('date', 'read_value')
  
  // If the request contains query parameters, values should be valid or the query returns No Content.
  // If they are valid, we use .modify to handle optional parameters (using the helper function).
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(qB => setQueryFilters(qB, request.query))
    } else {
      return response.status(204).end()
    }
  }
  
  listQuery
    .orderBy('date')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This function handles the inserting of new farms' data into the database.
export function saveData(request, response) {
  const contentType = request.headers['content-type']

  if (contentType.includes('multipart/form-data')) {
    prepareDataFromCsv(request, response)
  } else if (contentType === 'application/json' || contentType === 'text/plain') {
    prepareDataFromText(request, response)
  } else {
    return response.status(400).send("There was a problem with your request.")
  }
}
