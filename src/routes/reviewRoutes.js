const express = require('express')
const { giveReview, getRestaurantReviews } = require('../services/ReviewService')
const router = express.Router()

router.post('give-review', giveReview)
router.get('get-reviews', getRestaurantReviews)

module.exports = router