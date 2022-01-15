import express from 'express'
// In DEPLOYMENT,, we need to import a few more modules (uncomment these lines).
// import cors from 'cors'
// import * as path from 'path'

import farms from './routes/farms-route.js'
import data from './routes/data-route.js'
import { endpointHandler, errorHandler } from './utils/middleware.js'

import { appConfig } from './config/config.js'

const app = express()

// In DEPLOYMENT, enable cors for our frontend (since the proxy won't work).
if(process.env.NODE_ENV === 'production') {
  //app.use(cors({ origin: 'https://localhost:3000', methods: 'GET, POST'
  app.use(cors({ origin: process.env.APP_URL, methods: 'GET, POST', credentials: true}))
}

// Requests defined in the routing.
app.use('/farms', farms)
app.use('/data', data)

// Used in DEPLOYMENT for loading the static (frontend) files.
if(process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve()
  app.use(express.static(path.join(__dirname, 'build')))
  app.get('/*', (_, res) => { res.sendFile(path.join(__dirname, 'build', 'index.html')) })  
}

// Setting to use the middlewares.
// This is to handle all disallowed methods and non-implemented endpoints.
app.use(endpointHandler)
// This is for enhanced error-handling (used mostly when inserting).
app.use(errorHandler)

// Port config is stored in config file (under config folder)
app.listen(appConfig.port, () => console.log(`Server running on port ${appConfig.port}`))
