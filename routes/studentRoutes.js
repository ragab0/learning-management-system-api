const ets = require("express");
const authControllers = require("../controllers/authControllers");
const userHandlers = require("../controllers/handlers/userHandlers");
const studentControllers = require("../controllers/studentControllers");
const chatRoutes = require("./chatRoutesNested");

const router = ets.Router();

router.use(authControllers.protect);

/**
 * 00) mutating the messages routes;
 */

router.use("/chats", chatRoutes);

/**
 * 00) admin routes
 */

router
  .route("/")
  .get(
    authControllers.assignableTo("admin"),
    userHandlers.getAllUsersOf("student")
  )
  .post(
    authControllers.assignableTo("admin"),
    userHandlers.createUserOf("student")
  )
  .put(
    authControllers.assignableTo("admin"),
    userHandlers.updateUserOf("student")
  )
  .delete(
    authControllers.assignableTo("admin"),
    userHandlers.deleteUserOf("student")
  );

/**
 * 01) basic student ifno (profile)
 */
router
  .route("/profile")
  .get(userHandlers.getBasicInfoOf("student"))
  .put(userHandlers.updateBasicInfoOf("student"));

/**
 * 02) routing the student courses routes [enrolled, archived, cart, wishlist, baughtCourseContent]
 *
 */

// enrolled;
router
  .route("/courses")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getEnrolledCourses
  )
  .post(
    authControllers.assignableTo("student"),
    studentControllers.enrollNewCourse
  )
  .put(
    authControllers.assignableTo("student"),
    studentControllers.archiveEnrolledCourse
  );
// enrolled content
router
  .route("/courses/study")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getBaughtCourseContent
  );

// archived;
router
  .route("/courses/archived")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getArchivedCourses
  )
  .post(
    authControllers.assignableTo("student"),
    studentControllers.archiveEnrolledCourse
  )
  .put(
    authControllers.assignableTo("student"),
    studentControllers.unArchiveCourse
  );

// cart
router
  .route("/courses/cart")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getCartCourses
  )
  .post(
    authControllers.assignableTo("student"),
    studentControllers.addCartCourse
  )
  .put(
    authControllers.assignableTo("student"),
    studentControllers.removeCartCourse
  );

// wishlist;
router
  .route("/courses/wishlist")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getWishlistCourses
  )
  .post(
    authControllers.assignableTo("student"),
    studentControllers.addWishlistCourse
  )
  .put(
    authControllers.assignableTo("student"),
    studentControllers.removeWishlistCourse
  );

// enrolled course full content && progress;
router
  .route("/courses/:courseId")
  .get(
    authControllers.assignableTo("student"),
    studentControllers.getBaughtCourseContent
  );
router
  .route("/courses/:courseId/progress")
  .post(
    authControllers.assignableTo("student"),
    studentControllers.updateBaughtCourseProgress
  );

// checkout card courses
router
  .route("/cart/checkout")
  .post(authControllers.assignableTo("student"), studentControllers.checkout);

/**
 * 03) routing the student teachers routes
 */

router.route("/mentors").get(studentControllers.getAssignedTeachers);

module.exports = router;
