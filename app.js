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

// 01 body barser:
app.use(express.json());

// 02 global logger:
app.use(function (req, _, next) {
  console.log("The server is hitted by", req.url);
  next();
});

// 03 mounting routes middles:
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", userRoutes);

// XX main global catcher for handling CATCHING && PASSING un-handled/un-mounted routes:
app.all("*", function (req, res, next) {
  next(new AppError("Can't find on the server the: " + req.originalUrl, 404));
});

// XX main error handler - last middle;
app.use(mainErrorController);

module.exports = app;
