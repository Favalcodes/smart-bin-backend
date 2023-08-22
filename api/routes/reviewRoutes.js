const express = require('express')
const { giveReview, getRestaurantReviews } = require('../services/ReviewService')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/give-review', validateToken, giveReview)
router.get('/get-reviews', validateToken, getRestaurantReviews)

module.exports = router