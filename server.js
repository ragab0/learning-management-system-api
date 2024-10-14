const app = require("./app");
const connectDatabase = require("./configs/database");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const { port } = process.env;

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */
app.listen(port || 3500, "localhost", function () {
  console.log("Server is running on", port);
});
