const ets = require("express");
const authControllers = require("../controllers/authControllers");
const router = ets.Router();

/** special endpoints */
router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/logout").post(authControllers.logout);

module.exports = router;
