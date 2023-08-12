const express = require('express')
const { createReservation, cancelReservation, getUserReservations, getRestaurantGuests } = require('../services/GuestService')
const router = express.Router()

router.post('create-reservation', createReservation)
router.post('cancel-reservation', cancelReservation)
router.get('get-reservations', getUserReservations)
router.get('get-guests', getRestaurantGuests)

module.exports = router