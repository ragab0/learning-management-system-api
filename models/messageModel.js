const mongoose = require("mongoose");

const messageSchema = {
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contentType: {
    type: String,
    enum: ["text", "image", "file"],
  },
  isRead: { type: Boolean, default: false },
  content: String,
  createdAt: Date,
};

const Message = mongoose.Model("Message", messageSchema);
module.exports = Message;
