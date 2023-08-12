const mongoose = require("mongoose");
const { adminRole } = require("../constants");

const AdminSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    role: {type: String, enum: Object.values(adminRole), default: adminRole.SUPER_ADMIN},
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

const adminModel = mongoose.model("Admin", AdminSchema);
module.exports = adminModel;
