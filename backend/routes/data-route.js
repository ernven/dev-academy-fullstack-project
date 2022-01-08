import { Router } from 'express'

import { listFarmsData, createFarmsData } from '../controllers/data-controller.js'

const router = Router()

// GET all farms data.
router.get('/', listFarmsData)

// POST new farm data from csv.
router.post('/', createFarmsData)

export default router
