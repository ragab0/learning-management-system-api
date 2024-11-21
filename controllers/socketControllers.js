const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Message = require("../models/messageModel");
const ChatRoom = require("../models/chatRoomModel");

// Middleware controller to protect the communication server;
function protectSocket(socket, next) {
  try {
    // Parse cookies from the handshake headers
    const cookies = socket.handshake.headers.cookie
      ? cookie.parse(socket.handshake.headers.cookie)
      : {};
    const token = cookies["jwt"];
    if (!token) throw new Error("Authentication token is missing!");
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach { id, role, iat, exp }
    socket.currentUser = decoded;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Authentication error"));
  }
}

async function handleNewMessageEvent(socket, msgData, io) {
  try {
    // 01 assign the message with the current user (verified) regardless of the incoming request
    msgData = { ...msgData, sender: socket.currentUser.id };

    // 02 check if the user is already part of the room;
    const chatRoom = await ChatRoom.findById(msgData.roomId);
    if (!chatRoom) {
      throw new Error("Room isn't exist");
    }

    if (
      chatRoom[socket.currentUser.role]?._id.toString() !==
      socket.currentUser.id
    ) {
      throw new Error("You don't have access to this room!");
    }

    // 03 ceate the massage & make it last one at the room;
    const msg = await Message.create({ ...msgData, createdAt: Date.now() });
    chatRoom.lastMessage = msg;
    chatRoom.isActive = true;
    await chatRoom.save();

    // 04 emit the saving;
    io.to(chatRoom._id.toString()).emit("savedMessage", msg);
    // io.sockets.in(chatRoom._id.toString()).emit("savedMessage", msg);
  } catch (error) {
    io.emit("error", error);
  }
}

module.exports = {
  protectSocket,
  handleNewMessageEvent,
};
