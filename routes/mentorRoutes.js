const ets = require("express");
const authControllers = require("../controllers/authControllers");
const userHandlers = require("../controllers/handlers/userHandlers");
const mentorControllers = require("../controllers/mentorControllers");
const reviewRoutes = require("../routes/reviewRoutes");

const router = ets.Router();
app.use(authControllers.protect);

router
  .route("/")
  .get(
    authControllers.assignableTo("admin"),
    userHandlers.getAllUsersOfRole("mentor")
  )
  .post(
    authControllers.assignableTo("admin"),
    userHandlers.createUserOfRole("mentor")
  )
  .put(
    authControllers.assignableTo("admin"),
    userHandlers.updateUserOfRole("mentor")
  )
  .delete(
    authControllers.assignableTo("admin"),
    userHandlers.deleteUserOfRole("mentor")
  );

/**
 * 00) mutating the review routes;
 */
router.use("/reviews", reviewRoutes);

/**
 * 01) basic mentor ifno (profile)
 */
router
  .route("/profile")
  .get(userHandlers.getBasicInfoOf("mentor"))
  .put(userHandlers.updateBasicInfoOf("mentor"));

/**
 * 02) routing the mentor courses routes [enrolled, enrolledContent, archived, cart, wishlist]
 */

module.exports = router;
