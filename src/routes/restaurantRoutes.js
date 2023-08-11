const express = require('express')
const { registerRestaurant, onboardRestaurant, loginRestaurant, getRestaurant, updateRestaurant } = require('../services/RestaurantService')
const router = express.Router()

router.post('/register', registerRestaurant)
router.post('/onboard-restaurant', onboardRestaurant)
router.get('/get-restaurant', getRestaurant)
router.post('/login', loginRestaurant)
router.post('/update', updateRestaurant)

module.exports = router