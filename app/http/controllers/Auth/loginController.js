const { validationResult } = require("express-validator");
const User = require("../../../models/user");
var passport = require("./../../../passport/passport-local");

class loginController {
  index(req, res) {}

  async loginProcces(req, res, next) {
    const result = validationResult(req);
    console.log("body is : ", req.body);
    if (!result.isEmpty()) {
      console.log(result);
      //const errors = result.array().map((e) => {e.path: e.msg});
      return res.json(result);
    } else {
      passport.authenticate("local.login", (err, user, info) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }
        if (!user) {
          return res.status(400).json({ msg: info.message });
        }
        req.login(user, async (err) => {
          if (err) {
            return res.status(500).json({ msg: "Internal server error" });
          }
          console.log("user is :", user);
          return res.status(200).json({ success: true });
        });
      })(req, res, next);
    }
  }
}

module.exports = new loginController();
