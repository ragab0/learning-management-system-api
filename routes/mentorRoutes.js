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
 * 01) mutating the review routes;
 */
router.use("/reviews", reviewRoutes);

module.exports = router;
