const mongoose = require("mongoose");

const companyTypeSchema = new mongoose.Schema({
  type: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const companyType = mongoose.model("CompanyType", companyTypeSchema );

module.exports = companyType;
