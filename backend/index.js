import express from 'express'

import farms from './routes/farms.js'
import data from './routes/data.js'

import { appConfig } from './config/config.js'

const app = express()

// Basic endpoint (To be removed later? I don't know if there's any use for it)
app.get('/', (_, response) => response.status(200).send('Back End working.'))

// Requests defined in the routing
app.use('/farms', farms)
app.use('/data', data)

// Port config is stored in config file (under config folder)
app.listen(appConfig.port, () => console.log(`Server running on port ${appConfig.port}`))
