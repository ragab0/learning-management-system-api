const express = require("express");
const authControllers = require("../controllers/authControllers");
const reviewController = require("../controllers/reviewControllers");

const router = express.Router();

/** course reviews */
router.route("/course/:courseId").get(reviewController.getAllReviewsOfCourse);
/** mentor reviews */
router.route("/mentor/:mentorId").get(reviewController.getAllReviewsOfMentor);

/** student reviews */
// get by cookie's ID not param user to prevent any user to get of another user;
router.use(authControllers.protect, authControllers.assignableTo("student")); // not admin...

router.route("/student").post(reviewController.addReview);
router
  .route("/student/:courseId")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);

module.exports = router;
