const express = require("express");
const authControllers = require("../controllers/authControllers");
const reviewController = require("../controllers/reviewControllers");

/**
 * as a sub route they will inherit the authonticated from the base routes;
 */

const router = express.Router();

router
  .route("/")
  .post(authControllers.protect, reviewController.addReview)
  .delete(authControllers.protect, reviewController.deleteReview);

router.route("/course/:courseId").get(reviewController.getAllReviewsOfCourse); // public

router
  .route("/mentor") // get by cookie's ID not param user to prevent any user to get of another user;
  .get(
    authControllers.protect,
    authControllers.assignableTo("mentor"),
    reviewController.getAllReviewsOfMentor
  );
router
  .route("/student") // get by cookie's ID not param user to prevent any user to get of another user;
  .get(
    authControllers.protect,
    authControllers.assignableTo("student"),
    reviewController.getAllReviewsOfStudent
  );

module.exports = router;
