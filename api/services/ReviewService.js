const reviewModel = require("../models/Reviews");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");

const giveReview = asyncHandler(async (req, res) => {
  const { stars, review } = req.body;
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
  if (!stars) {
    res.status(400);
    throw new Error("Review stars is required");
  }
  const feedback = await reviewModel.create({
    stars,
    review,
    user: id,
  });
  res.status(200).json({
    success: true,
    message: "Review given successfully",
    review: feedback,
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.find({});
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

module.exports = { giveReview, getReviews };
