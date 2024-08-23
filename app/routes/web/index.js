const express = require("express");
const app = express();
const router = express.Router();
const { body, validationResult } = require("express-validator");
const loginController = require("../../http/controllers/Auth/loginController");
const singUpController = require("../../http/controllers/Auth/signupController");
const passport = require("passport");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const Company = require("../../models/company");
const companyType = require("../../models/companyType");
const PersonPosition = require("../../models/personPosition");
const Person = require("../../models/person");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "/uploads/images" });

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/inquiry", (req, res) => {
  res.render("inquiry.ejs");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login.ejs");
  }
});

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("please enter username"),
    body("password").notEmpty().withMessage("please enter correct password"),
  ],
  loginController.loginProcces
);

router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    console.log("session is:", req.session);
    res.redirect("/login"); //Inside a callback… bulletproof!
  });

  console.log("loged out!");
});

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("please enter username"),
    body("password").notEmpty().withMessage("please enter correct password"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("please enter correct passwordddd"),
  ],
  singUpController.signUpProccess
);

router.get("/chat", (req, res) => {
  res.render("chat.ejs");
});

router.get("/bahesab", (req, res) => {
  res.render("bahesab.ejs");
});

router.get("/comments", (req, res) => {
  res.render("comments.ejs");
});


router.get("/companies", (req, res) => {
  res.render("companies.ejs");
});



module.exports = router;
