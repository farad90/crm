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
const upload = multer({ dest: "uploads/" });

/////////// to send all comments to front ////////////

router.get("/api/comments", async (req, res) => {
  let comments = await Comment.find().populate("postedBy");
  console.log(comments);
  res.send(comments);
});

////////// to store comment on database ////////////

router.post("/api/comments", async (req, res) => {
  console.log("user is: ", req.user._id);

  let commentData = {
    comment_text: req.body.cmntContent,
    postedBy: req.user._id,
    repliedTo: req.body.repliedTo,
  };

  await Comment.create(commentData).then(async (newCmnt) => {
    newCmnt = await Comment.populate(newCmnt, { path: "postedBy" });
    console.log(newCmnt);
    res.send(newCmnt);
  });
});

///////////// like and dislike by pressing like Btn /////////////

router.put("/api/comments/:id/like", async (req, res) => {
  let cmntId = req.params.id;
  let userId = req.user._id;
  let isLiked = req.user.likes && req.user.likes.includes(cmntId);
  let option = isLiked ? "$pull" : "$addToSet";

  // add or remove comments Id to the user when likes or dislikes

  req.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: cmntId } },
    { new: true }
  );

  //add or remove userId to the comment liked or disliked by user

  await Comment.findByIdAndUpdate(
    cmntId,
    { [option]: { likedBy: userId } },
    { new: true }
  );

  console.log(cmntId);
  res.send(cmntId);
});

//////////// to store a new company on database ////////////////

router.post("/api/companies",upload.single("companyLogo"), async (req, res) => {
  let companyData = {
    name_EN: req.body.name_EN,
    name_FA: req.body.name_FA,
    abbreviation: req.body.abbreviation,
    companyType: req.body.companyType,
    regNo: req.body.regNo,
    idNo: req.body.idNo,
    CEO_EN: req.body.CEO_EN,
    CEO_FA: req.body.CEO_FA,
    commercialCode: req.body.commercialCode,
    phone: req.body.phone,
    Email: req.body.email,
    website: req.body.website,
    postalCode: req.body.postalCode,
    address_EN: req.body.address_EN,
    address_FA: req.body.address_FA,
  };

  if (req.file) {
    console.log("req contains files");
    ////// changes the upload destination from tempPath to targetPath //////
    let filePath = `uploads/images/companyLogos/${req.body.abbreviation}.png`;
    let tempPath = req.file.path;
    console.log(req.file.path)
    let targetPath = path.join(__dirname, `../../../${filePath}`);

    fs.rename(tempPath, targetPath, (err) => {
      console.log(err);
    });

    companyData["companyLogo"] = filePath;
  }

  console.log("req is:", req.body);
  await Company.create(companyData)
    .then((newCompany) => {
      res.send(newCompany);
      console.log(newCompany);
    })
    .catch((err) => console.log(err));
});

////////// to send companies datas to frontEnd ////////

router.get("/api/companies", async (req, res) => {
  let companies = await Company.find();
  res.send(companies);
});



/////////// to delete a company ////////////////////

router.delete("/api/companies/:id",async(req,res)=>{
  let companyId = req.params.id;
  await Company.findByIdAndDelete(companyId)
  .then(res.send("company deleted"))
})


////////////////to get a company information /////////////


router.get("/api/companies/:id",async(req,res)=>{
  let companyId = req.params.id;
  await Company.findById(companyId)
  .then(company => res.send(company))
  .catch(err=>console.log(err))
})



//////// to store a new person in database /////////////

router.post("/api/people", async (req, res) => {
  console.log("req is:", req.body);
  await Person.create({
    firstname_EN: req.body.firstname_EN,
    lastname_EN: req.body.lastname_EN,
    firstname_FA: req.body.firstname_FA,
    lastname_FA: req.body.FA,
    workingAt: req.body.workingAt,
    position: req.body.position,
    phone: req.body.phone,
    cellPhone: req.body.cellPhone,
    email: req.body.email,
    address_EN: req.body.address_EN,
    address_FA: req.body.address_FA,
  })
    .then((newPerson) => console.log(newPerson))
    .catch((err) => console.log(err));

  res.send("success");
});

////// to send persons to the front ///////////

router.get("/api/people", async (req, res) => {
  let people = await Person.find();
  res.send(people);
});

router.post("/api/companytypes", async (req, res) => {
  await companyType
    .create({
      type: req.body.type,
      createdBy: "65b24f22d1ff60c0bb57846d",
    })
    .then((newCompanyType) => console.log(newCompanyType))
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.get("/api/companytypes", async (req, res) => {
  const companyTypes = await companyType.find();
  res.send(companyTypes);
});

router.post("/api/personposition", async (req, res) => {
  await PersonPosition.create({
    position: req.body.position,
    createdBy: "65b24f22d1ff60c0bb57846d",
  })
    .then((newPersonPosition) => console.log(newPersonPosition))
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.get("/api/personposition", async (req, res) => {
  const personPositions = await PersonPosition.find();
  res.send(personPositions);
});

module.exports = router;
