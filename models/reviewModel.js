const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
    index: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

/** indexes */

// to ensure that one review for each course;
reviewSchema.index({ student: 1, course: 1 }, { unique: true });
// to faster retrieving by field;
reviewSchema.index({ student: 1 });
reviewSchema.index({ mentor: 1 });
reviewSchema.index({ course: 1 });

/* Pre-hook for automatic population */
reviewSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "course",
      select: "title",
    },
    {
      path: "student",
      select: "fname lname photo",
    },
  ]);
  next();
});

/** Instance method for aggregations */
reviewSchema.statics.getCourseRatingStatsAndDistribution = async function (
  courseId
) {
  try {
    // Aggregate the average rating and total review count
    const stats = await this.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$course",
          averageRating: { $avg: "$rating" },
          totalReviews: { $count: {} },
        },
      },
    ]);

    // Aggregate the distribution of ratings
    const ratingDistribution = await this.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$rating",
          count: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0, // Remove _id
          rating: "$_id", // Rename to rating
          count: 1,
        },
      },
      { $sort: { rating: -1 } },
    ]);

    // Calculate the percentage of each rating
    const totalReviews = stats[0]?.totalReviews || 0;
    const distribution = ratingDistribution.map((item) => ({
      ...item,
      percentage: ((item.count / totalReviews) * 100).toFixed(2),
    }));

    return {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews,
      ratingDistribution: distribution,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
