const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.SchemaTypes.ObjectId, ref: "Restaurant" },
    subCategory: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "MenuSubcategory",
    },
    name: String,
    price: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const menuModel = mongoose.model("Menu", MenuSchema);

module.exports = menuModel;
