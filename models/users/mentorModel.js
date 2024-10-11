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

/**
 * Instance methods:
 */

mentorSchema.methods.getBasicInfo = function () {
  const { taughtCourses, password, __t, ...filteredInfo } = this.toObject();
  return filteredInfo;
};

const Mentor = User.discriminator("Mentor", mentorSchema);
module.exports = Mentor;
