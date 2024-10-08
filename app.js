const AppError = require("./utils/appError");
const { default: mongoose } = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./configs/documentation");
const mainErrorController = require("./controllers/handlers/errorHandlers");

const authRouter = require("./routes/authRoutes");
const studentRouter = require("./routes/studentRoutes");
const logger = require("./controllers/handlers/logger");

/** setup the app && middles && mutating the routes */
const app = express();

// 01) barser of req-res middles:
app.use(express.json());
app.use(cookieParser());

// 02) global logger for us:
app.use(logger);

// 03) mounting the app documentation;
app.use(
  "/api/v1/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// 04 mounting the app routes;
app.use("/api/v1/", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/mentor", authRouter);
app.use("/api/v1/admin", authRouter);

/* 00) global catcher for handling/CATCHING the un-handled/un-mounted routes: */
app.all("*", function (req, res, next) {
  next(new AppError("Can't find on the server the: " + req.originalUrl, 404));
});

/* 00) main error handler that will catch any error that will occur at our entire app either this error is: operation/none; */
app.use(mainErrorController);

module.exports = app;
