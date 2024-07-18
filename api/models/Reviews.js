const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    stars: { type: Number },
    review: { type: String },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model('Review', ReviewSchema)

module.exports = reviewModel
