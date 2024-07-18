const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String },
    landmark: { type: String },
    time: { type: String },
    date: { type: Date },
    paid: { type: Boolean, default: false },
    amountPaid: { type: String },
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    userCancelled: { type: Boolean, default: false },
    adminCancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const scheduleModel = mongoose.model("Schedule", ScheduleSchema);

module.exports = scheduleModel;
