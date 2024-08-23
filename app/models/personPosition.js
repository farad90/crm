const mongoose = require("mongoose");

const personPositionSchema = new mongoose.Schema({
  position: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("PersonPosition", personPositionSchema);
