const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    firstname_EN:String,
    lastname_EN:String,
    firstname_FA:String,
    lastname_FA:String,
    workingAt:{type: mongoose.Schema.Types.ObjectId , ref: "Company"},
    position: {type: mongoose.Schema.Types.ObjectId , ref: "PersonPosition"},
    phone:String,
    cellPhone:String,
    email:String,
    address_EN:String,
    address_FA:String,
})


module.exports = mongoose.model("Person",personSchema)