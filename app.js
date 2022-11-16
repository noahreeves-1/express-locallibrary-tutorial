var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

const compression = require("compression");
const helmet = require("helmet");

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const dev_db_url =
  "mongodb+srv://hkburner:hkburner123!@cluster0.4pmdlyq.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/* MONGO DB CONNECTION STRING
mongodb+srv://hkburner:Westpark4!@cluster0.4pmdlyq.mongodb.net/local_library?retryWrites=true&w=majority
*/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// compress all routes for faster delivery of HTTP responses sent to the client (if they support this specific compression method)
// NOTE - FOR HIGHER TRAFFIC WEBSITES IN PRODUCTION, YOU WOULDN'T USE THIS METHOD... YOU WOULD USE A REVERSE-PROXY LIKE NGINX
app.use(compression());

app.use(helmet()); // protects against well-known web vulnerabilities
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
