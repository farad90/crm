const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./../models/user");
const bcrypt = require("bcrypt");

//Serialize determines which data of the user object should be stored in the session when you log in
// for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
passport.serializeUser((user, done) => {
  console.log("serializing");
  done(null, user.id);
});

// The first argument of deserializeUser corresponds to the key of the user object that was given to the done function
// That key here is the user id

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    console.log("deserializing");
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});

passport.use(
  "local.login",
  new localStrategy(async function (username, password, done) {
    console.log("we are here in local.login strategy");
    try {
      const user = await User.findOne({ username: username });
      console.log("user is:", username);
      if (!user) {
        console.log("user not found");
        return done(null, false,{ message: "No user found"});
      }
      const isCorrect = user.password === password;
      if (!isCorrect) {
        console.log("password is wrong");
        return done(null, false, { message: "Password is not correct" });
      } else {
        console.log("yesssss");
        return done(null, user);
      }
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = passport;
