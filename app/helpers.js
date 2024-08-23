const { json } = require("body-parser");

module.exports = class Helpers {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  auth() {
    return { check: this.req.isAuthenticated(), user: this.req.user};
  }
}
