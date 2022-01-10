import { Router } from 'express'

import { listData, listDataWithFilters, listDataByPeriod, createFarmsData } from '../controllers/data-controller.js'

const router = Router()

// GET all farms data.
router.get('/', listData)

// GET farms data using filters.
router.get('/filter', listDataWithFilters)

// GET data from input year and/or month.
router.get('/year/:year/:month?', listDataByPeriod)

// GET data from input year and month.

// POST new farm data from csv.
router.post('/', createFarmsData)

export default router
