const mongoose = require("mongoose");
const { role } = require("../constants");

const RestaurantSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    city: String,
    state: String,
    tempPassword: String,
    role: {type: String, enum: Object.values(role)},
    emailOtp: String,
    isEmailVerified: {type: Boolean, default: false},
    doneOnboarding: {type: Boolean, default: false},
    image: String,
    openTime: [
      {
        day: String,
        from: String,
        to: String,
      },
    ],
    isFree: {type: Boolean, default: false},
    bookingFee: String,
    isSuspended: {type: Boolean, default: false},
    suspendedAt: Date,
    isDeleted: {type: Boolean, default: false},
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const restaurantModel = mongoose.model("Restaurant", RestaurantSchema);

module.exports = restaurantModel;
