const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const uploadRoutes = require("./routes/web/uploadRoute.js");
const apiRoute = require("./routes/api/index.js")
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Helpers = require("./helpers");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  connectionStateRecovery: {},
});

var flash = require('connect-flash');

class application {
  constructor() {
    this.setConfigs();
    this.setMongoConnection();
    this.setupExpress();
    this.setRouters();
    this.setSocketConfig();
  }

  setConfigs() {
    app.set("view engine", "ejs");
    app.set("views", "./views");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(express.static(path.join(__dirname, 'public')))
    app.use(express.static("public"));
    app.use(
      session({
        secret: "mySecretKey",
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, //Equals to 1 day
        },
        store: MongoStore.create({
          mongoUrl: "mongodb://127.0.0.1:27017/test",
        }),
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
      app.locals = new Helpers(req, res).auth();
      next();
    });
  }

  async setMongoConnection() {
    await mongoose
      .connect("mongodb://127.0.0.1:27017/test")
      .then(console.log("connected to Database ..."))
      .catch((err) => console.log(err));
  }

  setupExpress() {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server is listening on port ${port} ...`);
    });
  }

  setRouters() {
    app.use(require("./routes/web/index.js"));
    app.use(apiRoute);
    app.use("/uploads",uploadRoutes)
  }

  setSocketConfig() {
    io.on("connection", (socket) => {
      console.log(`Socket connected`);
      socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        console.log("message: " + msg);
      });
    });
  }
}

module.exports = application;
