const express = require('express')

const config = require('./config/config')

const app = express()

// Basic endpoint (To be removed later? I don't know if there's any use for it)
app.get('/', (_, response) => response.status(200).send('Back End working.'))

// Port config is stored in config file (under config folder)
app.listen(config.app.port, () => console.log(`Server running on port ${config.app.port}`))
