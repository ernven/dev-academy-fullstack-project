import knex from 'knex'

import { dbConfig } from '../config/config.js'

const query = knex(dbConfig)

// This method gets all Farm names from the database.
export const listFarms = (_, response) =>
  query('farm')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))

// This method is used for inserting a new farm into the database.
export const createFarm = (request, _) =>
  console.log(request)
