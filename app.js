var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
var config = require("./config/database");
const Log = require("./v1/models/Log");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req, res, next) {
    var user = {};
    if (req.headers && req.headers.authorization) {
        var parted = req.headers.authorization.split(" ");
        if (parted.length === 2) {
            user = jwt.verify(parted[1], config.secret);
        }
    }
    var log = {
        user: user._id ? user._id : null,
        url: req.url,
        method: req.method,
        headers: req.headers,
        query: req.query,
        body: req.body,
    };
    Log(log).save((err, data) => {
        if(err)
            console.log(err);
    })
    next();
});

const v1 = require("./v1/routes");
app.use("/api/v1", v1);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
    
});

mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => {
    console.log("Connected to the database");
    console.log("Server started at port " + process.env.PORT);
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = app;
