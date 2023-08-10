const mongoose = require("mongoose");

const MenuSubcategorySchema = new mongoose.Schema(
  {
    name: String,
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'ModelCategory'},
    restaurant: { type: mongoose.SchemaTypes.ObjectId, ref: "Restaurant" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const menuSubcategoryModel = mongoose.model("MenuSubcategory", MenuSubcategorySchema);

module.exports = menuSubcategoryModel;
