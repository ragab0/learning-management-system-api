const ets = require("express");
const router = ets.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const mentorRoutes = require("./mentorRoutes");
const studentRoutes = require("./studentRoutes");

router.route("/api/v1/", authRoutes);
// router.route("/api/v1/courses", coursesRoutes);
router.route("/api/v1/admin", adminRoutes);
router.route("/api/v1/mentors", mentorRoutes);
router.route("/api/v1/students", studentRoutes);

module.exports = router;
