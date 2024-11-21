const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  course: {
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
