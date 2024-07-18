const { customAlphabet } = require("nanoid");
const userModel = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const { role } = require("../constants");
const guestModel = require("../models/Schedule");
const restaurantModel = require("../models/Restaurant");

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    res.status(400);
    throw new Error("Email, Password and Role are required");
  }
  const isExist = await userModel.findOne({ email });
  const isUserExist = await userModel.findOne({ email });
  if (isExist || isUserExist) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const newPassword = await bcrypt.hash(password, 10);
  const nanoid = await customAlphabet("1234567890", 6);
  const emailOtp = nanoid();
  const admin = await userModel.create({
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

const getAllUsers = asyncHandler(async (req, res) => {
  const id = req.admin._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const admin = await userModel.findById(id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin does not exist");
  }
  const users = await userModel.find();
  res.status(200).json({ success: true, message: "Users record found", users });
});

const getAllSchedules = asyncHandler(async (req, res) => {
  const id = req.admin._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const admin = await userModel.findById(id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin does not exist");
  }
  const reservations = await guestModel.find();
  const restaurantPromises = reservations.map(async (item) => {
    const restaurant = await restaurantModel.findById(item.restaurant);
    const user = await userModel.findById(item.user);
    return {
      ...item.toObject(),
      restaurant: restaurant.toObject(),
      user: user.toObject(),
    };
  });

  const allReservations = await Promise.all(restaurantPromises);
  res.status(200).json({
    success: true,
    message: "Reservations found",
    reservations: allReservations,
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and Password are required");
  }
  const admin = await userModel.findOne({ email });

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

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.admin.id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const admin = await userModel.findById(id);
  if (admin && (await bcrypt.compare(oldPassword, admin.password))) {
    await userModel.update({ id }, { password: bcrypt.hash(newPassword, 10) });
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
  getAllUsers,
  getAllSchedules,
};
