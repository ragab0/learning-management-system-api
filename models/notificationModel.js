const mongoose = require("mongoose");

const notificationSchema = {
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  recieversIds: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      isRead: { type: Boolean, default: false },
    },
  ],
  type: {
    type: String,
    enum: ["message", "course_update", "assignment", "announcement"],
  },
  content: String,
  createdAt: Date,
};

const Notification = mongoose.Model("Notification", notificationSchema);
module.exports = Notification;
