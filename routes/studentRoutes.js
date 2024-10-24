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
 * 00) mutating the review routes;
 */
router.use("/reviews", reviewRoutes);

/**
 * 01) basic student ifno (profile)
 */
router
  .route("/profile")
  .get(userHandlers.getBasicInfoOf("student"))
  .put(userHandlers.updateBasicInfoOf("student"));

/**
 * 02) routing the student courses routes [enrolled, enrolledContent, archived, cart, wishlist]
 */

// enrolled;
router
  .route("/courses")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getEnrolledCourses
  )
  .post(
    authControllers.assignableTo("student", "admin"),
    studentControllers.enrollNewCourse
  )
  .put(
    authControllers.assignableTo("student", "admin"),
    studentControllers.archiveEnrolledCourse
  );
// enrolled content
router
  .route("/courses/study")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getOwnCourseContent
  );

// archived;
router
  .route("/courses/archived")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getArchivedCourses
  )
  .post(
    authControllers.assignableTo("student", "admin"),
    studentControllers.archiveEnrolledCourse
  )
  .put(
    authControllers.assignableTo("student", "admin"),
    studentControllers.unArchiveCourse
  );

// cart
router
  .route("/courses/cart")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getCartCourses
  )
  .post(
    authControllers.assignableTo("student", "admin"),
    studentControllers.addCartCourse
  )
  .put(
    authControllers.assignableTo("student", "admin"),
    studentControllers.removeCartCourse
  );

// wishlist;
router
  .route("/courses/wishlist")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getWishlistCourses
  )
  .post(
    authControllers.assignableTo("student", "admin"),
    studentControllers.addWishlistCourse
  )
  .put(
    authControllers.assignableTo("student", "admin"),
    studentControllers.removeWishlistCourse
  );

// enrolled content;
router
  .route("/courses/:courseId")
  .get(
    authControllers.assignableTo("student", "admin"),
    studentControllers.getOwnCourseContent
  );

// checkout card courses
router
  .route("/cart/checkout")
  .post(
    authControllers.assignableTo("student", "admin"),
    studentControllers.checkout
  );

/**
 * 03) routing the student teachers routes
 */

router.route("/mentors").get(studentControllers.getAssignedTeachers);

/**
 * 04) routing the student chats routes
 */

// router.get("/chats",  studentController.getAllChates);
// router.get("chats/:id",  studentController.getChat);

module.exports = router;
