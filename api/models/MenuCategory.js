const mongoose = require("mongoose");

const MenuCategorySchema = new mongoose.Schema(
  {
    name: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const menuCategoryModel = mongoose.model("MenuCategory", MenuCategorySchema);

module.exports = menuCategoryModel;
