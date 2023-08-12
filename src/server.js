const express = require('express')
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/errorHandler')
const connectDb = require('./config/database')
require('dotenv').config()

const app = express()
connectDb(process.env.MONGO_URL)

app.use(bodyParser.json({type: 'application/json'}))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/restaurant', require('./routes/restaurantRoutes'))
app.use('/api/guest', require('./routes/guestRoutes'))
app.use('/api/review', require('./routes/reviewRoutes'))
app.use('/api/menu', require('./routes/menuRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log('Server started on 4000')
})