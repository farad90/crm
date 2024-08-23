const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");

router.get("/images/companyLogos/:path", (req, res, next) => {
    console.log("hi",req.params.path)
    res.sendFile(path.join(__dirname,"../../../uploads/images/companyLogos/",req.params.path));
  });

module.exports = router;
