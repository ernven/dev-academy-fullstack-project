import type { Request, Response } from 'express'
import knex from 'knex'

import { dbConfig } from '../config/config.js'
import { isValidFarmName } from '../utils/validator.js'

const query = knex(dbConfig)

export function listFarms(_: Request, response: Response) {
  query('farms')
    .orderBy('farm_name')
    .then(r => r.length !== 0 ? response.status(200).json(r) : response.status(204).end())
    .catch(err => response.status(500).json({error: err}))
}

export function handleFarmInsert(request: Request, response: Response) {
  let body: string

  request
    .on('data', chunk => body = chunk)
    .on('end', () => {
      try {
        const entry = JSON.parse(body)

        return isValidFarmName(entry.farm_name)
          ? insertFarm(entry, response)
          : response.status(400).send('Error: Invalid input name (' + entry.farm_name + ').')
      } catch {
        return response.status(400).send('There was a problem with your request.')
      }
  })
}

function insertFarm(entry: {farm_name: string}, response: Response) {
  query('farms').insert(entry)
    .then(r => response.status(201).json({command: JSON.stringify(r, null, "  "), status: 'success'}))
    .catch(err => response.status(200).json({error: err}))
}
