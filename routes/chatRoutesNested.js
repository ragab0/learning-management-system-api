const ets = require("express");
const chatControllers = require("../controllers/chatControllers");

const router = ets.Router({ mergeParams: true });

router.route("/").get(chatControllers.getAllActiveChatsOfCurrentUser);

router.route("/:roomId").get(chatControllers.getChatMessages);

module.exports = router;
