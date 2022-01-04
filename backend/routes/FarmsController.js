import { Router } from 'express'

import { getFarms, submitNewFarm } from '../services/FarmService.js'

const router = Router()

// GET the names of all the farms.
router.get('/', getFarms)

// POST a new farm.
router.post('/', submitNewFarm)

export default router
