const ets = require("express");
const courseControllers = require("../controllers/courseControllers");
const authControllers = require("../controllers/authControllers");
const reviewControllers = require("../controllers/reviewControllers");

const router = ets.Router();
router.use("/:courseId/reviews", reviewControllers.getAllReviewsOf);

router
  .route("/")
  .get(courseControllers.getCourses)
  .post(
    authControllers.protect,
    authControllers.assignableTo("mentor", "admin"),
    courseControllers.createCourse
  );

router
  .route("/:courseId")
  .get(courseControllers.getCourse)
  .put(
    authControllers.protect,
    authControllers.assignableTo("mentor", "admin"),
    courseControllers.updateCourse
  )
  .delete(
    authControllers.protect,
    authControllers.assignableTo("mentor", "admin"),
    courseControllers.deleteCourse
  );

module.exports = router;
