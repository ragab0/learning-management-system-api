const mongoose = require("mongoose");
const User = require("./_baselUserSchema");

const mentorSchema = new mongoose.Schema({
  taughtCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  expertise: [String],
  rating: { type: Number, min: 0, max: 5 },
});

const Mentor = User.discriminator("Mentor", mentorSchema);
module.exports = Mentor;
