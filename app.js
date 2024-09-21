const AppError = require("./utils/appError");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mainErrorController = require("./controllers/errorControllers");
const app = express();

/**
 * setting up our all middles
 *
 */

// 01 body barser of req-res middles:
app.use(express.json());

// 02 global logger for us:
app.use(function (req, _, next) {
  console.log("The server is hitted by", req.url);
  next();
});

// 03 mounting routes middles:
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", userRoutes);

// XX main global catcher for handling/CATCHING the un-handled/un-mounted routes:
app.all("*", function (req, res, next) {
  next(new AppError("Can't find on the server the: " + req.originalUrl, 404));
});

/*
 * XX main error handler - last middle;
 * >> a middleware that will catch any error that will occur at our entire app either this error is:
 *    01 operational (we created by ourself) using the new AppError class;
 *    02 not operationa (happend from express, mongodb, any unknown error);
 *
 */
app.use(mainErrorController);

module.exports = app;
