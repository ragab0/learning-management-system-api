const app = require("./app");
const connectDatabase = require("./configs/database");
const dotenv = require("dotenv");

dotenv.config({ path: "./env" });
const { PORT = 3500, NODE_ENV } = process.env;

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */
app.listen(
  PORT,
  NODE_ENV === "development" ? "localhost" : "0.0.0.0",
  function () {
    console.log("Server is running on", PORT);
  }
);
