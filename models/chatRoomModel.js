const mongoose = require("mongoose");

const chatRoomSchema = {
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  createdAt: Date,
  updatedAt: Date,
};

const ChatRoom = mongoose.Model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
