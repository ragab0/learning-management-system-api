const AppError = require("./utils/appError");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./configs/documentation");
const mainErrorController = require("./controllers/handlers/errorHandlers");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const topRoutes = require("./routes/topRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const commentRoutes = require("./routes/commentRoutes");
const logger = require("./controllers/handlers/logger");

/** setup the app && middles && mutating the routes */
const app = express();

// 01) barser of req-res middles: [json, cookies, compression,]
app.use(
  cors({
    origin: [
      "http://localhost:3000", // dev !!!!!!!!!!!!!
      "http://localhost:3001", // dev !!!!!!!!!!!!!
      "https://lms-depi-final-project.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// 02) global logger for us:
app.use(logger);

// 03) mounting the app documentation;
app.use(
  "/api/v1/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// 04 mounting the app routes;
app.use("/api/v1/", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/top", topRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/comments", commentRoutes);

/* 00) global catcher for handling/CATCHING the un-handled/un-mounted routes: */
app.all("*", function (req, res, next) {
  next(
    new AppError(
      `Can't find on the server the: (${req.method}) ${req.originalUrl}`,
      404
    )
  );
});

/* 00) main error handler that will catch any error that will occur at our entire app either this error is: operation/none; */
app.use(mainErrorController);

module.exports = app;
