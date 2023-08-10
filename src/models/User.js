const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String,
    phoneOtp: String,
    isPhoneVerified: Boolean,
    emailOtp: String,
    isEmailVerified: Boolean,
    isDeleted: Boolean,
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
