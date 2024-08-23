const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    profilePic : {type:String , default:"/images/profilePic.png"},
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    commentedOn : {type: mongoose.Schema.Types.ObjectId , ref: "Item"},
    likes : [{type: mongoose.Schema.Types.ObjectId , ref: "comment"}]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
/* 
userSchema.pre("save", (req, res, next) => {
  bcrypt.hash(req.body.password, bcrypt.genSalt(10), (err, hash) => {
    this.password = hash;
  });
}); */

const User = mongoose.model("User", userSchema);

module.exports = User;
