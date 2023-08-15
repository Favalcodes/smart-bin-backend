const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    numberOfGuest: { type: Number },
    time: { type: String },
    date: { type: Date },
    paid: { type: Boolean, default: false },
    amountPaid: { type: String },
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    userCancelled: { type: Boolean, default: false },
    restaurantCancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const guestModel = mongoose.model("Guest", GuestSchema);

module.exports = guestModel;
