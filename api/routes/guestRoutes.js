const express = require("express");
const {
  createReservation,
  cancelReservation,
  getUserReservations,
  getRestaurantGuests,
} = require("../services/GuestService");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.post("/create-reservation", validateToken, createReservation);
router.post("/cancel-reservation", validateToken, cancelReservation);
router.get("/get-reservations", validateToken, getUserReservations);
router.get("/get-guests", validateToken, getRestaurantGuests);

module.exports = router;
