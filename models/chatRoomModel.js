const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  isActive: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date,
});

chatRoomSchema.index({ student: 1, mentor: 1 }, { unique: true });
chatRoomSchema.index({ student: 1, isActive: true });
chatRoomSchema.index({ mentor: 1, isActive: true });

/* Pre-hook for automatic population */
chatRoomSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "lastMessage",
    },
    {
      path: "student",
      select: "fname lname photo",
    },
    {
      path: "mentor",
      select: "fname lname photo",
    },
  ]);
  next();
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
