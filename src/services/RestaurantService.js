const asyncHandler = require('express-async-handler')
const restaurantModel = require('../models/Restaurant')
const bcrypt = require('bcrypt')
const { customAlphabet } = require('nanoid')
const { role } = require('../constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const registerRestaurant = asyncHandler( async (req, res) => {
    const { email, name } = req.body
    if(!email || !name) {
        res.status(400)
        throw new Error('Email or Name is required')
    }
    const isEmailExist = await restaurantModel.findOne({email})
    if(isEmailExist) {
        res.status(400)
        throw new Error('Email already exist')
    }
    const isNameExist = await restaurantModel.findOne({name})
    if(isNameExist) {
        res.status(400)
        throw new Error('Name already exist')
    }
    const nanoid = customAlphabet('1234567890abcdef', 10)
    const password = nanoid()
    const hashedPassword = bcrypt.hash(password, 10)
    const restaurant = await restaurantModel.create({email, name, password: hashedPassword})
    res.status(200).json({success: true, message: 'Restaurant created successfully', restaurant})
})

const loginRestaurant = asyncHandler( async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(400)
        throw new Error('Email and Password is required')
    }
    const restaurant = await restaurantModel.findOne({email})
    if(!restaurant) {
        res.status(404)
        throw new Error('Email does not exist')
    }
    if(restaurant && (await bcrypt.compare(password, restaurant.password))) {
        const token = jwt.sign({
            restaurant,
            role: role.RESTAURANT
        }, process.env.JWT, {expiresIn: '1day'})
        res.status(200).json({success: true, message: 'Login successful', restaurant, token})
    }
    res.status(400)
    throw new Error('Password is incorrect')
})

const onboardRestaurant = asyncHandler( async (req, res) => {
    const {image, openTime, isFree, bookingFee } = req.body
    const id = req.restaurant.id
    const restaurant = await restaurantModel.findById(id)
    if(!restaurant) {
        res.status(404)
        throw new Error('Restaurant does not exist')
    }
    if(image){
        restaurant.image = image
    }
    if (openTime) {
        restaurant.openTime = openTime
    }
    if (isFree) {
        restaurant.isFree = isFree
    }
    if (bookingFee) {
        restaurant.bookingFee = bookingFee
    }
    const updated = await restaurantModel.update({id}, restaurant)
    res.status(200).json({success: true, message: 'Restaurant updated successfully', restaurant: updated})
})