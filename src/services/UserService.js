const { customAlphabet } = require("nanoid");
const userModel = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }
  const isExist = await userModel.findOne({ phoneNumber });
  if (isExist) {
    throw new Error("Phone number already exist");
  }
  const nanoid = await customAlphabet("1234567890", 6);
  const phoneOtp = nanoid();
  const user = await userModel.create({ phoneNumber, phoneOtp });
  res
    .status(200)
    .json({
      success: true,
      message:
        "User Registered Successfully, Otp has been sent to Phone number",
      user,
    });
});

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userId = req.params.userId;
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please fill all details");
  }
  const isExist = await userModel.findOne({ email });
  if (isExist) {
    throw new Error("Email already exist");
  }
  const newPassword = await bcrypt.hash(password, 10);
  const nanoid = await customAlphabet("1234567890", 6);
  const emailOtp = nanoid();
  const user = await userModel.update(
    { id: userId },
    { firstName, lastName, email, password: newPassword, emailOtp }
  );
  res
    .status(200)
    .json({
      success: true,
      message: "User Updated Successfully, Otp has been sent to email",
      user,
    });
});

const verifyPhoneNumber = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { otp } = req.body;
  const otpExist = await userModel.findOne({ id: userId, phoneOtp: otp });
  if (!otpExist) {
    throw new Error("Invalid otp");
  }
  const user = await userModel.update(
    { id: userId },
    { isPhoneVerified: true }
  );
  res
    .status(200)
    .json({
      success: true,
      message: "Phone number verified successfully",
      user,
    });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { otp } = req.body;
  const otpExist = await userModel.findOne({ id: userId, emailOtp: otp });
  if (!otpExist) {
    throw new Error("Invalid otp");
  }
  const user = await userModel.update(
    { id: userId },
    { isEmailVerified: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Email verified successfully", user });
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
      .json({ success: true, message: "Logged in successfully", token });
  }
  throw new Error("Login not successful");
});

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;
  const userId = req.user.id;
  const nanoid = await customAlphabet("1234567890", 6);
  if (email) {
    const isEmailExist = await userModel.findOne({email})
    if(!isEmailExist) {
      res.status(404)
      throw new Error("Email does not exist")
    }
    const emailOtp = nanoid();
    await userModel.update({ id: userId }, { emailOtp });
    res.status(200).json({ success: true, message: "Otp sent" });
  }
  if (phoneNumber) {
    const isPhoneExist = await userModel.findOne({phoneNumber})
    if(!isPhoneExist) {
      res.status(404)
      throw new Error("Phone number does not exist")
    }
    const phoneOtp = nanoid();
    await userModel.create({ phoneNumber, phoneOtp });
    res.status(200).json({ success: true, message: "Otp sent" });
  }
  res.status(404).json({success: false, message: 'No means for verification provided'})
});

const updatePassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const userId = req.user.id
    const user = await userModel.findById(userId)
    if(user && (await bcrypt.compare(oldPassword, user.password))) {
        await userModel.update({id: userId}, {password: bcrypt.hash(newPassword, 10)})
        res.status(200).json({success: true, message: 'Password updated successfully'})
    }
    res.status(404)
    throw new Error('Old password is incorrect')
})

module.exports = {
  registerUser,
  updateUser,
  verifyEmail,
  verifyPhoneNumber,
  loginUser,
  sendVerificationCode,
  updatePassword
};
