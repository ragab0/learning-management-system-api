const ets = require("express");
const chatControllers = require("../controllers/chatControllers");

const router = ets.Router({ mergeParams: true });

router.route("/").get(chatControllers.getAllChatsOfCurrentUser);

router.route("/:roomId").get(chatControllers.getChatMessages);

module.exports = router;
