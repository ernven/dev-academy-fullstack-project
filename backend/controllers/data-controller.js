import knex from 'knex'

import { dbConfig } from '../config/config.js'
import { isValidEntry, isValidQuery } from '../utils/validator.js'

const query = knex(dbConfig)

// This -helper- function sets additional filter to the DB query.
const setQueryFilters = (queryBuilder, params) => {
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

// This method gets Farms' data from the DB (either all or filtered with request parameters).
export const listFarmsData = (request, response) => {
  // We create the basic query structure.
  let listQuery = query('entry')
  listQuery
    .join('farm', 'entry.farm_id', 'farm.id')
    .select('entry_id', 'farm_name', 'date', 'entry_type', 'read_value')

  // If the request contains query parameters, values should be valid or the query returns No Content.
  // If they are valid, we use .modify to handle optional parameters (using the helper function).
  if (request.query) {
    if (isValidQuery(request.query)) {
      listQuery.modify(queryBuilder => setQueryFilters(queryBuilder, request.query))
    } else {
      return response.status(204).end()
    }
  }
  
  // We use promises to deal with our query returns.
  listQuery
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This method is used for inserting new farms' data into the database.
export const createFarmsData = (request, response) => {
  let body = []

  // The request body is manually parsed (not using libraries)
  request
    .on('data', chunk => body.push(chunk))
    .on('end', () => {
      try {
        const parsedBody = JSON.parse(Buffer.concat(body))

        // Iterating through the request body and validating the items using our validator.
        const validEntries = parsedBody.filter(entry => isValidEntry(entry))

        query('entry').insert(validEntries)
          .then(id => response.status(201).json({row: id}))
          .catch(err => response.status(500).json({error: err}))
      } catch {
        return response.status(400).send("There was a problem with your request.")
      }
  })
}
