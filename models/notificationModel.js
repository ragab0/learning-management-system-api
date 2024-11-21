const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  recievers: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      isRead: { type: Boolean, default: false },
    },
  ],
  type: {
    type: String,
    enum: ["message", "course_update", "assignment", "announcement"],
  },
  content: String,
  createdAt: Date,
});

const Notification = mongoose.Model("Notification", notificationSchema);
module.exports = Notification;
