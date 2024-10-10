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
  professionalDescription: String,
});

const Mentor = User.discriminator("Mentor", mentorSchema);
module.exports = Mentor;
