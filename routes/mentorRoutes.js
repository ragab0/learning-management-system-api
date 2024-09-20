const ets = require("express");
const authControllers = require("../controllers/authControllers");
const mentorControllers = require("../controllers/mentorControllers");
const router = ets.Router();

router
  .route("/")
  .get(
    authControllers.protect,
    authControllers.assignableTo("admin"),
    mentorControllers.getAllMentors
  );

module.exports = router;
