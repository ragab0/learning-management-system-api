const ets = require("express");
const authControllers = require("../controllers/authControllers");
const userHandlers = require("../controllers/handlers/userHandlers");
const mentorControllers = require("../controllers/mentorControllers");
const reviewRoutes = require("../routes/reviewRoutes");

const router = ets.Router();

router.route("/profile/:id").get(mentorControllers.getPublicBasicInfo);

router.use(authControllers.protect);

router
  .route("/")
  .get(
    authControllers.assignableTo("admin"),
    userHandlers.getAllUsersOf("mentor")
  )
  .post(
    authControllers.assignableTo("admin"),
    userHandlers.createUserOf("mentor")
  )
  .put(
    authControllers.assignableTo("admin"),
    userHandlers.updateUserOf("mentor")
  )
  .delete(
    authControllers.assignableTo("admin"),
    userHandlers.deleteUserOf("mentor")
  );

/**
 * 00) mutating the review routes;
 */
router.use("/reviews", reviewRoutes);

/**
 * 01) basic mentor ifno (profile)
 */
router.route("/profile").put(userHandlers.updateBasicInfoOf("mentor"));

/**
 * 02) routing the mentor courses
 */
router
  .route("/courses")
  .get(mentorControllers.getAllTaughtCourses)
  .post(mentorControllers.createCourse)
  .put(mentorControllers.updateTaughtCourse)
  .delete(mentorControllers.deleteTaughtCourse);
router
  .route("/courses/extract-playlist")
  .post(mentorControllers.youtubePlaylistExtractor);
router.route("/courses/:id").get(mentorControllers.getTaughtCourse);

module.exports = router;
