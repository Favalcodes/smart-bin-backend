const reviewModel = require("../models/Reviews");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");
const restaurantModel = require("../models/Restaurant");

const giveReview = asyncHandler(async (req, res) => {
  const { stars, restaurantId, review } = req.body;
  const id = req.user._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
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
  res.status(200).json({
    success: true,
    message: "Review given successfully",
    review: feedback,
  });
});

const getRestaurantReviews = asyncHandler(async (req, res) => {
  const filter = req.query.stars;
  const restaurantId = req.query.restaurant;
  if (!restaurantId) {
    res.status(400);
    throw new Error("Restaurant Id is required");
  }
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
  const userPromises = reviews.map(async item => {
    const user = await userModel.findById(item.user);
    return {
      ...item.toObject(),
      user: user.toObject()
    };
  });
  
  const allReviews = await Promise.all(userPromises);
  res
    .status(200)
    .json({ success: true, message: "Reviews retrieved", reviews: allReviews });
});

module.exports = { giveReview, getRestaurantReviews };
