const guestModel = require('../models/Guest')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/User')
const restaurantModel = require('../models/Restaurant')


const createReservation = asyncHandler( async (req, res) => {
    const {numberOfGuest, time, date, paid, amountPaid, restaurantId} = req.body
    if(!numberOfGuest || !time || !date || !paid || !amountPaid || !restaurantId) {
        res.status(400)
        throw new Error('Please fill all details')
    }
    const id = req.user.id
    const user = await userModel.findById(id)
    if(!user) {
        res.status(404)
        throw new Error('User does not exist')
    }
    const restaurant = await restaurantModel.findById(restaurantId)
    if(!restaurant) {
        res.status(404)
        throw new Error('Restaurant does not exist')
    }
    const guest = await guestModel.create({user, numberOfGuest, time, date, paid, amountPaid, restaurant: restaurantId})
    res.status(200).json({success: true, message: 'Reservation successfull', guest})
})

const getRestaurantGuests = asyncHandler( async (req, res) => {
    const id = req.restaurant.id
    const restaurant = await restaurantModel.findById(id)
    if(!restaurant) {
        res.status(404)
        throw new Error('Restaurant does not exist')
    }
    const guests = await guestModel.find({restaurant: id})
    res.status(200).json({success: true, message: 'Guest retrieved', guests})
})