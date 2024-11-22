const AppError = require("../utils/appError");
const catchAsyncMiddle = require("../utils/catchAsyncMiddle");
const { sendResults, sendResult } = require("./handlers/send");
const ChatRoom = require("../models/chatRoomModel");
const Message = require("../models/messageModel");

const getAllActiveChatsOfCurrentUser = catchAsyncMiddle(async function (
  req,
  res
) {
  const chats = await ChatRoom.find({
    [req.user.role || "student"]: req.user._id,
    isActive: true,
  });

  sendResults(res, chats);
});

const getChatMessages = catchAsyncMiddle(async function (req, res, next) {
  const { roomId } = req.params;

  // get the chat;
  const chat = await ChatRoom.findById(roomId);
  if (!chat) {
    return next(new AppError("Chat isn't exist!", 404));
  }

  // validate the current user is part of the target room;
  if (!chat[req.user.role]._id.equals(req.user._id)) {
    return next(new AppError("You're not part of that chat", chat, 403));
  }

  const msgs = await Message.find({
    roomId,
  });

  sendResult(res, { ...chat._doc, msgs });
});

module.exports = {
  getAllActiveChatsOfCurrentUser,
  getChatMessages,
};
