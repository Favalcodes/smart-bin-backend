const { customAlphabet } = require("nanoid");
const adminModel = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const { adminRole, role } = require("../constants");

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    res.status(400);
    throw new Error("Email, Password and Role are required");
  }
  if(role !== adminRole.SUB_ADMIN && role !== adminRole.SUPER_ADMIN) {
    res.status(400)
    throw new Error("Role should either be SUPER_ADMIN or SUB_ADMIN")
  }
  const isExist = await adminModel.findOne({ email });
  const isUserExist = await userModel.findOne({ email });
  if (isExist || isUserExist) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const newPassword = await bcrypt.hash(password, 10);
  const nanoid = await customAlphabet("1234567890", 6);
  const emailOtp = nanoid();
  const admin = await adminModel.create({
    email,
    role,
    password: newPassword,
    emailOtp,
  });
  res.status(200).json({
    success: true,
    message: "Admin Registered Successfully, Otp has been sent to Email",
    admin,
  });
});

// @TO-DO

// const updateUser = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   const userId = req.params.userId;
//   if (!firstName || !lastName || !email || !password) {
//     throw new Error("Please fill all details");
//   }
//   const isExist = await userModel.findOne({ email });
//   if (isExist) {
//     throw new Error("Email already exist");
//   }
//   const newPassword = await bcrypt.hash(password, 10);
//   const nanoid = await customAlphabet("1234567890", 6);
//   const emailOtp = nanoid();
//   const user = await userModel.update(
//     { id: userId },
//     { firstName, lastName, email, password: newPassword, emailOtp }
//   );
//   res
//     .status(200)
//     .json({
//       success: true,
//       message: "User Updated Successfully, Otp has been sent to email",
//       user,
//     });
// });

// const verifyPhoneNumber = asyncHandler(async (req, res) => {
//   const userId = req.params.userId;
//   const { otp } = req.body;
//   const otpExist = await userModel.findOne({ id: userId, phoneOtp: otp });
//   if (!otpExist) {
//     throw new Error("Invalid otp");
//   }
//   const user = await userModel.update(
//     { id: userId },
//     { isPhoneVerified: true }
//   );
//   res
//     .status(200)
//     .json({
//       success: true,
//       message: "Phone number verified successfully",
//       user,
//     });
// });

// const verifyEmail = asyncHandler(async (req, res) => {
//   const userId = req.params.userId;
//   const { otp } = req.body;
//   const otpExist = await userModel.findOne({ id: userId, emailOtp: otp });
//   if (!otpExist) {
//     throw new Error("Invalid otp");
//   }
//   const user = await userModel.update(
//     { id: userId },
//     { isEmailVerified: true }
//   );
//   res
//     .status(200)
//     .json({ success: true, message: "Email verified successfully", user });
// });

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and Password are required");
  }
  const admin = await adminModel.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = jwt.sign(
      {
        admin,
        role: role.ADMIN,
      },
      process.env.JWT,
      { expiresIn: "1day" }
    );
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token, admin });
  } else {
    res.status(500);
    throw new Error("Login not successful, admin does not exist");
  }
});

// @TO-DO

// const sendVerificationCode = asyncHandler(async (req, res) => {
//   const { email, phoneNumber } = req.body;
//   const userId = req.user.id;
//   const nanoid = await customAlphabet("1234567890", 6);
//   if (email) {
//     const isEmailExist = await userModel.findOne({email})
//     if(!isEmailExist) {
//       res.status(404)
//       throw new Error("Email does not exist")
//     }
//     const emailOtp = nanoid();
//     await userModel.update({ id: userId }, { emailOtp });
//     res.status(200).json({ success: true, message: "Otp sent" });
//   }
//   if (phoneNumber) {
//     const isPhoneExist = await userModel.findOne({phoneNumber})
//     if(!isPhoneExist) {
//       res.status(404)
//       throw new Error("Phone number does not exist")
//     }
//     const phoneOtp = nanoid();
//     await userModel.create({ phoneNumber, phoneOtp });
//     res.status(200).json({ success: true, message: "Otp sent" });
//   }
//   res.status(404).json({success: false, message: 'No means for verification provided'})
// });

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.admin.id;
  const admin = await adminModel.findById(id);
  if (admin && (await bcrypt.compare(oldPassword, admin.password))) {
    await adminModel.update({ id }, { password: bcrypt.hash(newPassword, 10) });
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  }
  res.status(404);
  throw new Error("Old password is incorrect");
});

module.exports = {
  registerAdmin,
  loginAdmin,
  updatePassword,
};
