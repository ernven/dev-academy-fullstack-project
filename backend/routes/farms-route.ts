import { Router } from 'express'

import { listFarms, handleFarmInsert } from '../controllers/farm-controller.js'

const router = Router()

// GET the names of all the farms.
router.get('/', listFarms)

// POST a new farm.
router.post('/', handleFarmInsert)

export default router
