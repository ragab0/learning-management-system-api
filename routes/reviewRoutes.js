const express = require("express");
const authControllers = require("../controllers/authControllers");
const reviewController = require("../controllers/reviewControllers");

/**
 * as a sub route they will inherit the authonticated from the base routes;
 */

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviewsOf)
  .post(
    authControllers.protect,
    authControllers.restrictTo("student, admin"),
    reviewController.createReview
  );
router
  .route("/:reviewId")
  .put(
    authControllers.protect,
    authControllers.restrictTo("student, admin"),
    reviewController.updateReview
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("student, admin"),
    reviewController.deleteReview
  );

module.exports = router;
