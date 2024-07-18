const userModel = require("../models/User");
const rulesModel = require("../models/Rules");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");
const { role } = require("../constants");
const restaurantModel = require("../models/Restaurant");

// Register and onboard function should be merged together
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
    if (isExist?.isPhoneVerified) {
      res.status(400);
      throw new Error("Phone number already exist, Please verify");
    }
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

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(400);
    throw new Error("User Id is required");
  }
  const user = await userModel.findById(userId);
  if (user) {
    res.status(200).json({
      success: true,
      message: "User retrieved Successfully",
      user,
    });
  } else {
    res.status(500);
    throw new Error("User doesn't exist");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Email does not exist");
  }
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
  res.status(400);
  throw new Error("Password is incorrect");
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
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

module.exports = {
  registerUser,
  onboardUser,
  verifyOtp,
  loginUser,
  sendVerificationCode,
  updatePassword,
  updateUserImage,
  getMe,
};
