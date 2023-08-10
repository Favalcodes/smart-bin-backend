const reviewModel = require("../models/Reviews");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");
const restaurantModel = require("../models/Restaurant");

const giveReview = asyncHandler(async (req, res) => {
  const { stars, restaurantId, review } = req.body;
  const id = req.user.id;
  const user = await userModel.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  if (!stars || !restaurantId) {
    res.status(400);
    throw new Error("Review stars and Restaurant is required");
  }
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const feedback = await reviewModel.create({
    stars,
    restaurant: restaurantId,
    review,
    user: id,
  });
  res.status(200).json({ success: true, message: "Review given successfully" });
});

const getRestaurantReviews = asyncHandler(async (req, res) => {
  const filter = req.params.filter;
  const restaurantId = req.params.id;
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  if (filter) {
    const reviews = await reviewModel.find({
      stars: filter,
      restaurant: restaurantId,
    });
    res
      .status(200)
      .json({ success: true, message: "Reviews retrieved", reviews });
  }
  const reviews = await reviewModel.find({ restaurant: restaurantId });
  res
    .status(200)
    .json({ success: true, message: "Reviews retrieved", reviews });
});

module.exports = { giveReview, getRestaurantReviews };
