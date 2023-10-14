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
app.use('/api/restaurant', require('./api/routes/restaurantRoutes'))
app.use('/api/guest', require('./api/routes/guestRoutes'))
app.use('/api/review', require('./api/routes/reviewRoutes'))
app.use('/api/menu', require('./api/routes/menuRoutes'))
app.use('/api/admin', require('./api/routes/adminRoutes'))
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`)
})

module.exports = app