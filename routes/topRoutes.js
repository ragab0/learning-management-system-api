const ets = require("express");
const mentorControllers = require("../controllers/mentorControllers");
const courseControllers = require("../controllers/courseControllers");

const router = ets.Router();
router.use(authControllers.protect);

// router.route("/categouries").get();
router.route("/courses").get(courseControllers.get);

router.route("/mentors").get(mentorControllers.get);

router.route("/comments").get();

module.exports = router;
