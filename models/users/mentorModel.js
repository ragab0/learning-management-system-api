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

const topMentors = Mentor.aggregate([
  {
    $project: {
      _id: 1,
      fname: 1,
      lname: 1,
      email: 1,
      active: 1,
      numberOfCourses: { $size: "$taughtCourses" }, // Calculate the number of created courses
    },
  },
  { $sort: { numberOfCourses: -1 } }, // Sort mentors by the number of courses in descending order
  { $limit: 10 }, // Limit to top 10 mentors
]).then((topMentors) => console.log(topMentors));

module.exports = Mentor;
