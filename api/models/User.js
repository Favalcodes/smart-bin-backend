const mongoose = require("mongoose");
const { role } = require("../constants");

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    image: String,
    role: {type: String, enum: Object.values(role)},
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
