const ets = require("express");
const authControllers = require("../controllers/authControllers");
const userControllers = require("../controllers/userControllers");
const router = ets.Router();

router
  .route("/")
  .get(
    authControllers.protect,
    authControllers.assignableTo("admin"),
    userControllers.getAllUsers
  );

module.exports = router;
