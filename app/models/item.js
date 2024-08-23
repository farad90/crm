const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    itemNo : string,
    createdBy: {type: mongoose.Schema.Types.ObjectId , ref: "User"}
})


const Item = mongoose.model("Item", itemSchema);

module.exports = Item ;
