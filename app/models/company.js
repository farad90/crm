const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name_EN: String,
  name_FA: String,
  abbreviation: String,
  companyType:{type: mongoose.Schema.Types.ObjectId , ref: "companyType"},
  regNo: Number,
  idNo: Number,
  CEO_EN: String,
  CEO_FA:String,
  commercialCode: Number,
  phone: String,
  Email: String,
  website: String,
  postalCode:String,
  address_EN: String,
  address_FA:String,
  companyLogo : String
});

module.exports = mongoose.model("Company", companySchema);
