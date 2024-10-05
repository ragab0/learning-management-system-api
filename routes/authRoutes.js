const ets = require("express");
const authControllers = require("../controllers/authControllers");
const authRouter = ets.Router();

/** special endpoints */
authRouter.route("/signup").post(authControllers.signup);
authRouter.route("/login").post(authControllers.login);
authRouter.route("/logout").post(authControllers.logout);

module.exports = authRouter;
