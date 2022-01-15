import express from 'express'

// UNCOMMENT FOR DEPLOYMENT
// import * as path from 'path'

import farms from './routes/farms-route.js'
import data from './routes/data-route.js'
import { endpointHandler, errorHandler } from './utils/middleware.js'

import { appConfig } from './config/config.js'

const app = express()

// Requests defined in the routing
app.use('/farms', farms)
app.use('/data', data)

/* UNCOMMENT FOR DEPLOYMENT

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', (_, res) => { res.sendFile(path.join(__dirname, 'build', 'index.html')) })

*/

// Setting to use the middlewares.
// This is to handle all disallowed methods and non-implemented endpoints.
app.use(endpointHandler)
// This is for enhanced error-handling (used mostly when inserting).
app.use(errorHandler)

// Port config is stored in config file (under config folder)
app.listen(appConfig.port, () => console.log(`Server running on port ${appConfig.port}`))
