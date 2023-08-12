const mongoose = require('mongoose')

const connectDb = async (url) => {
    const connect = await mongoose.connect(url)
    console.log('----database connected----')
    return connect
}

module.exports = connectDb