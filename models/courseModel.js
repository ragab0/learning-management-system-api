const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A lesson must have a title"],
  },
  srcVideo: String,
  content: String,
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A module must have a title"],
  },
  lessons: {
    type: [lessonSchema],
    validate: {
      validator: function (arr) {
        return arr && arr.length > 0;
      },
      message: "A module must contain at least one lesson",
    },
  },
});

const courseSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: [true, "A course must be assigned to a mentor"],
    },
    title: {
      type: String,
      required: [true, "A course must have a title"],
    },
    titleHook: {
      type: String,
      required: [true, "A course must have a hook title"],
    },
    levels: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one level",
      },
      enum: {
        values: ["all", "beginner", "intermediate", "advanced"],
        message: `{VALUE} doesn't match. Allowed values are [all, beginner, intermediate, advanced]`,
      },
    },
    languages: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one language",
      },
    },
    tags: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one tag",
      },
    },
    requirements: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one requirement",
      },
    },
    description: {
      type: String,
      required: [true, "A course must have a description"],
    },
    whatYoulLearn: [String],
    modules: {
      type: [moduleSchema],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "A course must contain at least one module",
      },
    },
    photo: String,
    price: { type: Number, defualt: 0 },
    enrolledStudentsCount: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    lastUpdatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
  }
);

/**
 * Aggr props:
 *  (RatesTotal, RatesCount, StudentsCount);
 *  [SectionsCount, LecturesCount, CourseDuration]
 *  [SectionLecturesCount, SectionDuration]
 */

courseSchema.virtual("studentCount").get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
