const mongoose = require("mongoose");

const chatRoomSchema = {
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  // mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      contentType: {
        type: String,
        enum: ["text", "image", "file"],
      },
      isRead: { type: Boolean, default: false },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  createdAt: Date,
  updatedAt: Date,
};

const ChatRoom = mongoose.Model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
