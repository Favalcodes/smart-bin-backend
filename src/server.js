const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
require('dotenv').config()

const app = express()

app.use(bodyParser.json({type: 'application/json'}))
app.use(errorHandler())

app.listen(process.env.PORT, () => {
    console.log('Server started on 4000')
})