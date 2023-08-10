const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    restaurant: { type: mongoose.SchemaTypes.ObjectId, ref: "Restaurant" },
    numberOfGuest: { type: Number },
    time: { type: String },
    date: { type: Date },
    paid: { type: Boolean, default: false },
    amountPaid: { type: String },
    isCancelled: {type: Boolean, default: false},
    cancelledAt: { type: Date}
  },
  {
    timestamps: true,
  }
);

const guestModel = mongoose.model('Guest', guestSchema)

module.exports = guestModel
