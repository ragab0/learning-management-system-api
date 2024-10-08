const ets = require("express");
const authControllers = require("../controllers/authControllers");
const userHandlers = require("../controllers/handlers/userHandlers");
const studentControllers = require("../controllers/studentControllers");
const reviewRoutes = require("./reviewRoutes");

const router = ets.Router();
router.use(authControllers.protect);

router
  .route("/")
  .get(
    authControllers.assignableTo("admin"),
    userHandlers.getAllUsersOfRole("student")
  )
  .post(
    authControllers.assignableTo("admin"),
    userHandlers.createUserOfRole("student")
  )
  .put(
    authControllers.assignableTo("admin"),
    userHandlers.updateUserOfRole("student")
  )
  .delete(
    authControllers.assignableTo("admin"),
    userHandlers.deleteUserOfRole("student")
  );

/**
 * 01) mutating the review routes;
 */
router.use("/reviews", reviewRoutes);

/**
 * 02) routing the student courses routes [enrolled, wishlist, cartlist]
 */

router
  .route("/courses")
  .get(
    authControllers.restrictTo("student", "admin"),
    studentControllers.getEnrolledCourses
  )
  .post(
    authControllers.restrictTo("student", "admin"),
    studentControllers.enrollNewCourse
  )
  .delete(
    authControllers.restrictTo("student", "admin"),
    studentControllers.archiveEnrolledCourse
  );

router
  .route("/courses/wishlist")
  .get(
    authControllers.restrictTo("student", "admin"),
    studentControllers.getFavouriteCourses
  )
  .post(
    authControllers.restrictTo("student", "admin"),
    studentControllers.addCourseToFavourite
  )
  .delete(
    authControllers.restrictTo("student", "admin"),
    studentControllers.archiveEnrolledCourse
  );

router
  .route("/courses/cartlist")
  .get(
    authControllers.restrictTo("student", "admin"),
    studentControllers.getCartCourses
  )
  .post(
    authControllers.restrictTo("student", "admin"),
    studentControllers.addCourseToCart
  )
  .delete(
    authControllers.restrictTo("student", "admin"),
    studentControllers.removeCourseFromCart
  );

/**
 * 03) routing the student teachers routes
 */

router.route("/teachers").get(studentControllers.getAssignedTeachers);

/**
 * 04) routing the student chats routes
 */

// router.get("/chats",  studentController.getAllChates);
// router.get("chats/:id",  studentController.getChat);

module.exports = router;
