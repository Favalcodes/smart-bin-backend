const guestModel = require("../models/Guest");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/User");
const restaurantModel = require("../models/Restaurant");

const createReservation = asyncHandler(async (req, res) => {
  const { numberOfGuest, time, date, paid, amountPaid, restaurantId } =
    req.body;
  if (
    !numberOfGuest ||
    !time ||
    !date ||
    !paid ||
    !amountPaid ||
    !restaurantId
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
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  const guest = await guestModel.create({
    user: id,
    numberOfGuest,
    time,
    date,
    paid,
    amountPaid,
    restaurant: restaurantId,
  });
  res
    .status(200)
    .json({ success: true, message: "Reservation successfull", guest });
});

const getRestaurantGuests = asyncHandler(async (req, res) => {
  const cancelled = req.query.cancelled;
  const id = req.restaurant?._id;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant does not exist");
  }
  if (cancelled) {
    const guests = await guestModel.find({
      restaurant: id,
      isCancelled: cancelled,
    });
    const userPromises = guests.map(async (item) => {
      const user = await userModel.findById(item.user);
      return {
        ...item.toObject(),
        user: user.toObject(),
      };
    });

    const updatedGuests = await Promise.all(userPromises);
    res
      .status(200)
      .json({
        success: true,
        message: "Guest retrieved",
        guests: updatedGuests,
      });
  }
  const guests = await guestModel.find({ restaurant: id });
  const userPromises = guests.map(async (item) => {
    const user = await userModel.findById(item.user);
    return {
      ...item.toObject(),
      user: user.toObject(),
    };
  });

  const updatedGuests = await Promise.all(userPromises);
  res
    .status(200)
    .json({ success: true, message: "Guest retrieved", guests: updatedGuests });
});

const getUserReservations = asyncHandler(async (req, res) => {
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
    const reservations = await guestModel.find({
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

const cancelReservation = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;
  const userId = req.user?._id;
  const restaurantId = req.restaurant?._id;
  const reservationId = req.query.id;
  if (!reservationId) {
    res.status(400);
    throw new Error("Reservation Id is required");
  }
  const now = new Date();
  if (userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }
    await guestModel.updateOne(
      { _id: reservationId },
      { isCancelled: true, cancelledAt: now, cancelReason, userCancelled: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Reservation successfully cancelled" });
  }
  if (restaurantId) {
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant does not exist");
    }
    await guestModel.updateOne(
      { _id: reservationId },
      {
        isCancelled: true,
        cancelledAt: now,
        cancelReason,
        restaurantCancelled: true,
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Reservation successfully cancelled" });
  }
  res.status(401);
  throw new Error("Reservation was not cancelled");
});

module.exports = {
  createReservation,
  getRestaurantGuests,
  getUserReservations,
  cancelReservation,
};
