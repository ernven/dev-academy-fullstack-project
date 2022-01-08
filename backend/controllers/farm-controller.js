import knex from 'knex'

import { dbConfig } from '../config/config.js'
import { isValidFarmName } from '../utils/validator.js'

const query = knex(dbConfig)

// This method gets all Farm names from the database.
export const listFarms = (_, response) =>
  query('farm')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))

// This method is used for inserting a new farm into the database.
export const createFarm = (request, response) => {
  let parsedBody

  // The request body is manually parsed (not using libraries)
  request
    .on('data', chunk => parsedBody = JSON.parse(chunk))
    .on('end', () => {
      try {
        // If errors are found, no inserting is done.
        isValidFarmName(parsedBody.farm_name) ?
          query('farm').insert(parsedBody)
            .then(id => response.status(201).json({row: id}))
            .catch(err => response.status(500).json({error: err})) :
          response.status(400).json({errors: errors})
      } catch {
        return response.status(400).send("There was a problem with your request.")
      }
  })
}
