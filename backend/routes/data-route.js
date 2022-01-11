import { Router } from 'express'

import {
  listData, listDataWithFilters, listDataByPeriod, listAverages,
  listMinMaxValues, listDataForCharts, saveData
} from '../controllers/data-controller.js'

const router = Router()

// GET all farms data.
router.get('/', listData)

// GET farms data using filters.
router.get('/filter', listDataWithFilters)

// GET data from input year and/or month.
router.get('/by-period/:year/:month?', listDataByPeriod)

// GET calculated data: averages, max values.
router.get('/averages', listAverages)
router.get('/extremes', listMinMaxValues)

// GET data formatted to draw charts with.
router.get('/chart-data', listDataForCharts)

// POST new farm data, either as JSON object(s) or from a CSV file.
router.post('/', saveData)


export default router
