const { validationResult } = require("express-validator");
const User = require("../../../models/user");
var passport = require("./../../../passport/passport-local");
const bcrypt = require("bcrypt");

class signUpController {
  index(req, res, next) {}

  async signUpProccess(req, res, next) {
    const result = validationResult(req);
    console.log("body is : ", req.body);
    if (!result.isEmpty()) {
      const errors = result.array().map((e) => e.msg);
      console.log(errors);
      return res.status(400).json({ errors });
    } else {
      const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      });
      if (user) {
        console.log("this user already exists");
        res.redirect("/signup");
      } else {
        console.log("creating new User");

        await User.create({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        }).then((result) => {
          console.log(result);
          res.redirect("/");
        });
      }
    }
  }
}

module.exports = new signUpController();
