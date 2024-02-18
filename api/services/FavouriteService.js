const favouriteModel = require("../models/Favourites");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");
const restaurantModel = require("../models/Restaurant");

const addOrRemoveFavourite = asyncHandler(async (req, res) => {
  const { restaurantId } = req.body;
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
  if (!restaurantId) {
    res.status(400);
    throw new Error("Restaurant is required");
  }
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const favourite = await favouriteModel.findOne({
    user: id,
    restaurant: restaurantId,
  });
  if (favourite) {
    await favouriteModel.deleteOne(favourite._id);
    res.status(200).json({
      success: true,
      message: "Restaurant removed from favourite successfully",
    });
  } else {
    await favouriteModel.create({
      restaurant: restaurantId,
      user: id,
    });
    res.status(200).json({
      success: true,
      message: "Restaurant added to favourite successfully",
    });
  }
});

const getFavourites = asyncHandler(async (req, res) => {
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
  const favourites = await favouriteModel.find({ user: id });
  const userPromises = favourites.map(async (item) => {
    const user = await userModel.findById(item.user);
    const restaurant = await restaurantModel.findById(item.restaurant);
    return {
      ...item.toObject(),
      user: user.toObject(),
      restaurant: restaurant.toObject(),
    };
  });

  const allFavourites = await Promise.all(userPromises);
  res
    .status(200)
    .json({
      success: true,
      message: "Favourites retrieved",
      reviews: allFavourites,
    });
});

module.exports = { addOrRemoveFavourite, getFavourites };
