const mongoose = require("mongoose");

const RulesSchema = new mongoose.Schema(
  {
    rules: String,
    policy: String,
    restaurant: { type: mongoose.SchemaTypes.ObjectId, ref: "Restaurant" },
  },
  {
    timestamps: true,
  }
);

const rulesModel = mongoose.model("Rules", RulesSchema);
module.exports = rulesModel;
