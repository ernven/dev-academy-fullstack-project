import knex from 'knex'

import { dbConfig } from '../config/config.js'
import { isValidFarmName } from '../utils/validator.js'

const query = knex(dbConfig)

// This method gets all Farm names from the database.
export function listFarms(_, response) {
  query('farms')
    .orderBy('farm_name')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

// This method is used for inserting a new farm into the database.
export function createFarm(request, response) {
  let body

  // The request body is manually parsed (not using libraries)
  request
    .on('data', chunk => body = chunk)
    .on('end', () => {
      try {
        const entry = JSON.parse(body)

        // If not valid, or errors are found, no inserting is done.
        isValidFarmName(entry.farm_name)
          ? query('farms').insert(entry)
            .then(r => response.status(201).json({command: r.command, status: 'success'}))
            .catch(err => response.status(200).json({error: err}))
          : response.status(400).send('Error: Invalid input name (' + entry.farm_name + ').')
      } catch {
        return response.status(400).send('There was a problem with your request.')
      }
  })
}
