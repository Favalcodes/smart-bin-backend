const scheduleModel = require("../models/Schedule");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");
const restaurantModel = require("../models/Restaurant");
const adminModel = require("../models/Admin");

// This is for user
const createSchedule = asyncHandler(async (req, res) => {
  const { address, time, date, paid, amountPaid, landmark } =
    req.body;
  if (
    !address ||
    !time ||
    !date ||
    !paid ||
    !amountPaid ||
    !landmark
  ) {
    res.status(400);
    throw new Error("Please fill all details");
  }
  const id = req.user?._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const user = await userModel.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  const guest = await scheduleModel.create({
    user: id,
    address,
    time,
    date,
    paid,
    amountPaid,
    landmark,
  });
  res
    .status(200)
    .json({ success: true, message: "Scheduled successfully", guest });
});

// this is for user
const getUserSchedules = asyncHandler(async (req, res) => {
  const cancelled = req.query.cancelled;
  const id = req.user?._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const user = await userModel.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  if (cancelled) {
    const reservations = await scheduleModel.find({
      restaurant: id,
      isCancelled: cancelled,
    });
    const reservationPromises = reservations.map(async (item) => {
      const restaurant = await restaurantModel.findById(item.restaurant);
      return {
        ...item.toObject(),
        restaurant: restaurant.toObject(),
      };
    });

    const updatedReservation = await Promise.all(reservationPromises);
    res
      .status(200)
      .json({
        success: true,
        message: "Guest retrieved",
        reservations: updatedReservation,
      });
  }
  const reservations = await guestModel.find({ user: id });
  const reservationPromises = reservations.map(async (item) => {
    const restaurant = await restaurantModel.findById(item.restaurant);
    return {
      ...item.toObject(),
      restaurant: restaurant.toObject(),
    };
  });

  const updatedReservation = await Promise.all(reservationPromises);
  res.status(200).json({
    success: true,
    message: "User reservations retrieved",
    reservations: updatedReservation,
  });
});

// This is for both users and admin
const cancelSchedule = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;
  const userId = req.user?._id; 
  const adminId = req.admin?._id;
  const scheduleId = req.query.id;
  if (!scheduleId) {
    res.status(400);
    throw new Error("Schedule Id is required");
  }
  const now = new Date();
  if (userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }
    await scheduleModel.updateOne(
      { _id: scheduleId },
      { isCancelled: true, cancelledAt: now, cancelReason, userCancelled: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Schedule successfully cancelled" });
  }
  if (adminId) {
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      res.status(404);
      throw new Error("Admin does not exist");
    }
    await scheduleModel.updateOne(
      { _id: scheduleId },
      {
        isCancelled: true,
        cancelledAt: now,
        cancelReason,
        adminCancelled: true,
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Schedule successfully cancelled" });
  }
  res.status(401);
  throw new Error("Schedule was not cancelled");
});

module.exports = {
  createSchedule,
  getUserSchedules,
  cancelSchedule,
};
