import { Router } from 'express'

import { listFarms, createFarm } from '../controllers/FarmController.js'

const router = Router()

// GET the names of all the farms.
router.get('/', listFarms)

// POST a new farm.
router.post('/', createFarm)

export default router
