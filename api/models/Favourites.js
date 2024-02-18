const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    restaurant: { type: mongoose.SchemaTypes.ObjectId, ref: "Restaurant" }
  },
  {
    timestamps: true,
  }
);

const favouriteModel = mongoose.model('Favourite', FavouriteSchema)

module.exports = favouriteModel
