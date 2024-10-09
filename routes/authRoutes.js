const ets = require("express");
const authControllers = require("../controllers/authControllers");
const authRouter = ets.Router();

/** special endpoints */
authRouter.route("/signup").post(authControllers.signup);
authRouter.route("/login").post(authControllers.login);
authRouter
  .route("/is-login")
  .get(authControllers.protect, authControllers.isLogin);
authRouter.route("/logout").post(authControllers.logout);

module.exports = authRouter;
