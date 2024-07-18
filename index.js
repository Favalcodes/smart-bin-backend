const express = require('express')
const bodyParser = require('body-parser')
const errorHandler = require('./api/middleware/errorHandler')
const connectDb = require('./api/config/database')
require('dotenv').config()

const app = express()
connectDb(process.env.MONGO_URL)

app.use(bodyParser.json({type: 'application/json'}))
app.get('/', (req, res) => {
    res.send('Server is running')
})
app.use('/api/user', require('./api/routes/userRoutes'))
app.use('/api/schedule', require('./api/routes/scheduleRoutes'))
app.use('/api/review', require('./api/routes/reviewRoutes'))
app.use('/api/admin', require('./api/routes/adminRoutes'))
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`)
})

module.exports = app