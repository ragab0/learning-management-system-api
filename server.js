const app = require("./app");
const connectDatabase = require("./configs/database");

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */
const port = 3500;
app.listen(port, "localhost", function () {
  console.log("Server is running on", port);
});
