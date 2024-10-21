const ets = require("express");
const mentorControllers = require("../controllers/mentorControllers");
const courseControllers = require("../controllers/courseControllers");

const router = ets.Router();

// router.route("/categouries").get();
router.route("/courses").get(courseControllers.getTopCourses);
router.route("/mentors").get(mentorControllers.getTopMentors);
// router.route("/comments").get();

module.exports = router;
