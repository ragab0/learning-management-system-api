/**
 *  configuring the db in both (local && remote) && check connection before dealing with the api;
 *
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("../app");
const AppError = require("../utils/appError");

dotenv.config({ path: ".env" });

const { NODE_ENV, DATABASE_LOCAL, DATABASE_REMOTE, DATABASE_PASSWORD } =
  process.env;

const connectDatabase = async () => {
  let db, options;

  if (NODE_ENV === "development") {
    db = DATABASE_LOCAL;
    options = {};
  } else {
    db = DATABASE_REMOTE.replace("<db_password>", DATABASE_PASSWORD);
    options = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    };
  }

  try {
    await mongoose.connect(db, options);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      `Pinged your ${NODE_ENV} database. You successfully connected to MongoDB!`
    );
  } catch (error) {
    console.log("DB connection failed.................................", error);
    return new Error("DB connection is failed! please report us"); // stop the app;
    // app.use(function (req, res, next) {
    //   // runs only once - on app starting ............................;
    //   next(new AppError("DB connection is failed! please report us."));
    // });
  }
};

module.exports = connectDatabase;
