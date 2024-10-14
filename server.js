const app = require("./app");
const connectDatabase = require("./configs/database");

const { PORT } = process.env;

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */
app.listen(PORT || 3500, "localhost", function () {
  console.log("Server is running on", PORT);
});
