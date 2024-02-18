const asyncHandler = require("express-async-handler");
const restaurantModel = require("../models/Restaurant");
const rulesModel = require("../models/Rules");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");
const { role } = require("../constants");
const jwt = require("jsonwebtoken");
const moment = require("moment");
require("dotenv").config();

const registerRestaurant = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    res.status(400);
    throw new Error("Email or Name is required");
  }
  const isEmailExist = await restaurantModel.findOne({ email });
  if (isEmailExist) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const isNameExist = await restaurantModel.findOne({ name });
  if (isNameExist) {
    res.status(400);
    throw new Error("Name already exist");
  }
  const nanoid = customAlphabet("1234567890abcdef", 10);
  const password = nanoid();
  const hashedPassword = await bcrypt.hash(password, 10);
  const restaurant = await restaurantModel.create({
    email,
    name,
    password: hashedPassword,
    tempPassword: password,
    role: role.RESTAURANT,
  });
  res.status(200).json({
    success: true,
    message: "Restaurant created successfully",
    restaurant,
  });
});

const loginRestaurant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and Password is required");
  }
  const restaurant = await restaurantModel.findOne({ email });
  if (!restaurant) {
    res.status(404);
    throw new Error("Email does not exist");
  }
  if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
    const token = jwt.sign(
      {
        restaurant,
        role: role.RESTAURANT,
      },
      process.env.JWT,
      { expiresIn: "1day" }
    );
    res
      .status(200)
      .json({ success: true, message: "Login successful", restaurant, token });
  }
  res.status(400);
  throw new Error("Password is incorrect");
});

const onboardRestaurant = asyncHandler(async (req, res) => {
  const { image, openTime, isFree, bookingFee } = req.body;
  const id = req.restaurant._id;
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  if (image) {
    restaurant.image = image;
  }
  if (openTime) {
    restaurant.openTime = openTime;
  }
  if (isFree) {
    restaurant.isFree = isFree;
  }
  if (bookingFee) {
    restaurant.bookingFee = bookingFee;
    restaurant.doneOnboarding = true;
  }
  const updated = await restaurantModel.updateOne({ _id: id }, restaurant);
  const updatedRestaurant = await restaurantModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Restaurant updated successfully",
    restaurant: updatedRestaurant,
  });
});

const getRestaurant = asyncHandler(async (req, res) => {
  const id = req.query.id || req.restaurant._id;
  if (!id) {
    res.status(400);
    throw new Error("Restaurant Id not provided");
  }
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  res
    .status(200)
    .json({ success: true, message: "Restaurant retrieved", restaurant });
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const id = req.restaurant._id;
  if (!id) {
    res.status(400);
    throw new Error("Restaurant Id not provided");
  }
  const isExist = await restaurantModel.findById(id);
  if (!isExist) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const restaurant = await restaurantModel.updateOne({ _id: id }, data);
  const updated = await restaurantModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Restaurant updated successfully",
    restaurant: updated,
  });
});

const getAllRestaurant = asyncHandler(async (req, res) => {
  const { date, time, city, state } = req.body;

  let restaurants;
  if (date) {
    const day = moment(date, "DD-MM-YYYY").format("dddd");
    const queryTime = moment(time, "h:mm A");
    console.log('----QUERY----', queryTime)
    restaurants = await restaurantModel.find({
      "openTime.day": day,
      "openTime.from": { $lte: queryTime.format("h:mm A") },
      "openTime.to": { $gte: queryTime.format("h:mm A") },
    });
  }
  if (city) {
    restaurants = await restaurantModel.find({ city });
  }
  if (state) {
    restaurants = await restaurantModel.find({ state });
  }
  if (!date && !time && !city && !state) {
    restaurants = await restaurantModel.find();
  }
  res
    .status(200)
    .json({ success: true, message: "Restaurants found", data: restaurants });
});

const addRulesAndPolicy = asyncHandler(async (req, res) => {
  try {
    const id = req.restaurant._id;
    if (!id) {
      res.status(400);
      throw new Error("Restaurant Id not provided");
    }
    const restaurant = await restaurantModel.findById(id);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant does not exist");
    }
    const { rules, policy } = req.body;
    const result = await rulesModel.create({ rules, policy, restaurant: id });
    res.status(200).json({
      success: true,
      message: "Rules and Policy added successfully",
      data: result,
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error: ${error}`);
  }
});

const updateRulesAndPolicy = asyncHandler(async (req, res) => {
  try {
    const { id, rules, policy } = req.body;
    const restaurantId = req.restaurant._id;
    if (!restaurantId) {
      res.status(400);
      throw new Error("Restaurant Id not provided");
    }
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant does not exist");
    }
    const isExist = await rulesModel.findById(id);
    if (!isExist) {
      res.status(404);
      throw new Error("Rules does not exist");
    }
    if (restaurantId != isExist.restaurant) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    await rulesModel.updateOne({ _id: id }, { rules, policy });
    const updated = await rulesModel.findById(id);
    res.status(200).json({
      success: true,
      message: "Rules and Policy updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error: ${error}`);
  }
});

module.exports = {
  registerRestaurant,
  loginRestaurant,
  onboardRestaurant,
  getRestaurant,
  updateRestaurant,
  getAllRestaurant,
  addRulesAndPolicy,
  updateRulesAndPolicy,
};
