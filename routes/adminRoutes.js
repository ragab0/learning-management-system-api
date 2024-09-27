const ets = require("express");
const authControllers = require("../controllers/authControllers");
const studentRoutes = require("./studentRoutes");
const mentorRoutes = require("./mentorRoutes");
const reviewRoutes = require("./reviewRoutes");

const router = ets.Router();
router.use(authControllers.protect, authControllers.assignableTo("admin"));

router.use("/students", studentRoutes);
router.use("/mentors", mentorRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
