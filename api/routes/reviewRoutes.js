const express = require('express')
const { giveReview, getReviews } = require('../services/ReviewService')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/give-review', validateToken, giveReview)
router.get('/get-reviews', validateToken, getReviews)

module.exports = router