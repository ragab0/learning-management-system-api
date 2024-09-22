const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  price: Number,
  discount: Number,
  createdAt: { type: Date, default: Date.now() },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
