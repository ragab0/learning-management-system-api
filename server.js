const app = require("./app");
const connectDatabase = require("./configs/database");
const dotenv = require("dotenv");

dotenv.config({ path: "./env" });
const { PORT } = process.env;

console.log(PORT);

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */
app.listen(PORT || 3500, "localhost", function () {
  console.log("Server is running on", PORT);
});
