const express = require("express");
const {
  registerRestaurant,
  onboardRestaurant,
  loginRestaurant,
  getRestaurant,
  updateRestaurant,
  getAllRestaurant,
} = require("../services/RestaurantService");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.post("/register", registerRestaurant);
router.post("/onboard-restaurant", validateToken, onboardRestaurant);
router.get("/get-restaurant", validateToken, getRestaurant);
router.post("/login", loginRestaurant);
router.post("/update", validateToken, updateRestaurant);
router.get("/restaurants", getAllRestaurant);

module.exports = router;
