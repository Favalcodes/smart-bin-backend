const userModel = require("../models/User");
const rulesModel = require("../models/Rules");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");
const { role } = require("../constants");
const restaurantModel = require("../models/Restaurant");

const registerUser = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400);
    throw new Error("Phone number is required");
  }
  const nanoid = await customAlphabet("1234567890", 6);
  const phoneOtp = nanoid();
  const isExist = await userModel.findOne({ phoneNumber });
  if (isExist) {
    await userModel.updateOne({ _id: isExist?.id }, { phoneOtp });
    res.status(400);
    throw new Error("Phone number already exist, Please verify");
  }
  const user = await userModel.create({
    phoneNumber,
    phoneOtp,
    role: role.USER,
  });
  res.status(200).json({
    success: true,
    message: "User Registered Successfully, Otp has been sent to Phone number",
    user,
  });
});

const onboardUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userId = req.query.id;
  if (!userId) {
    res.status(400);
    throw new Error("User Id is required");
  }
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill all details");
  }
  const isExist = await userModel.findOne({ email });
  if (isExist) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const newPassword = await bcrypt.hash(password, 10);
  const nanoid = customAlphabet("1234567890", 6);
  const emailOtp = nanoid();
  const data = await userModel.updateOne(
    { _id: userId },
    { firstName, lastName, email, password: newPassword, emailOtp }
  );
  if (data) {
    console.log("DATA", data);
    const user = await userModel.findOne({ email });
    res.status(200).json({
      success: true,
      message: "User Updated Successfully, Otp has been sent to email",
      user,
    });
  } else {
    res.status(500);
    throw new Error("User was not update");
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const userId = req.query.id;
  const { otp, route } = req.body;
  if (!userId) {
    res.status(400);
    throw new Error("User Id is required");
  }
  if (route === "PHONE") {
    const otpExist = await userModel.findOne({ _id: userId, phoneOtp: otp });
    if (!otpExist) {
      res.status(400);
      throw new Error("Invalid otp");
    }
    const user = await userModel.updateOne(
      { _id: userId },
      { isPhoneVerified: true }
    );
    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
      user,
    });
  } else {
    const otpExist = await userModel.findOne({ _id: userId, emailOtp: otp });
    if (!otpExist) {
      res.status(400);
      throw new Error("Invalid otp");
    }
    const user = await userModel.updateOne(
      { _id: userId },
      { isEmailVerified: true }
    );
    res
      .status(200)
      .json({ success: true, message: `Email verified successfully`, user });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }
  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT,
      { expiresIn: "1day" }
    );
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token, user });
  }
  throw new Error("Login not successful");
});

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;
  const userId = req.user._id;
  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const nanoid = await customAlphabet("1234567890", 6);
  if (email) {
    const isEmailExist = await userModel.findOne({ email });
    if (!isEmailExist) {
      res.status(404);
      throw new Error("Email does not exist");
    }
    const emailOtp = nanoid();
    await userModel.updateOne({ _id: userId }, { emailOtp });
    res.status(200).json({ success: true, message: "Otp sent" });
  }
  if (phoneNumber) {
    const isPhoneExist = await userModel.findOne({ phoneNumber });
    if (!isPhoneExist) {
      res.status(404);
      throw new Error("Phone number does not exist");
    }
    const phoneOtp = nanoid();
    await userModel.updateOne({ _id: userId }, { phoneOtp });
    res.status(200).json({ success: true, message: "Otp sent" });
  }
  res
    .status(404)
    .json({ success: false, message: "No means for verification provided" });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  const user = await userModel.findById(userId);
  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    await userModel.updateOne(
      { _id: userId },
      { password: bcrypt.hash(newPassword, 10) }
    );
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  }
  res.status(404);
  throw new Error("Old password is incorrect");
});

const searchRestaurant = asyncHandler(async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      res.status(400);
      throw new Error("Missing search term");
    }

    const result = await restaurantModel.find({
      $or: [
        { name: { $regex: term, $options: "i" } },
        { city: { $regex: term, $options: "i" } },
      ],
    });

    res
      .status(200)
      .json({ success: true, message: "Result found", data: result });
  } catch (error) {
    res.status(500);
    throw new Error(`Internal Server Error: ${error}`);
  }
});

const getRulesAndPolicy = asyncHandler(async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const rules = await rulesModel.findOne({ restaurant: restaurantId });
    res.status(200).json({
      success: true,
      message: "Rules and policy returned successfully",
      rules,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error: ${error}`);
  }
});

module.exports = {
  registerUser,
  onboardUser,
  verifyOtp,
  loginUser,
  sendVerificationCode,
  updatePassword,
  searchRestaurant,
  getRulesAndPolicy,
};
