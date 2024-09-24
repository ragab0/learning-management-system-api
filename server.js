const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

/**
 * 01 configuring && destructring the env vars:
 *
 */

dotenv.config({ path: "./.env" });
const { NODE_ENV, DATABASE_LOCAL, DATABASE_REMOTE, DATABASE_PASSWORD } =
  process.env;

/**
 * 02 configuring && connecting with the db in both (local && remote);
 *
 */

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

(async function () {
  try {
    await mongoose.connect(db, options);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log("DB connection is failled...", error);
  }
})();

/**
 * XX configuring && running our app:
 *
 */
const port = 3500;
app.listen(port, "localhost", function () {
  console.log("Server is running on", port);
});
