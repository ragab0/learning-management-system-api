const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null,
    required: [true, "A lesson must have a title"],
  },
  srcVideo: {
    type: String,
    default: null,
    required: [true, "A lesson must have a video source"],
  },
  duration: Object,
});

const moduleSchema = new mongoose.Schema({
  extractor: String,
  thumbnail: String,
  description: {
    type: String,
    default: null,
    required: [true, "A module must have a description"],
  },
  title: {
    type: String,
    default: null,
    required: [true, "A module must have a title"],
  },
  lessons: {
    type: [lessonSchema],
    default: [],
    validate: {
      validator: function (arr) {
        return arr && arr.length > 0;
      },
      message: "A module must contain at least one lesson",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const courseSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
      required: [true, "A course must be assigned to a mentor"],
    },
    title: {
      type: String,
      default: null,
      required: [true, "A course must have a title"],
    },
    titleHook: {
      type: String,
      default: null,
      required: [true, "A course must have a hook title"],
    },
    levels: {
      type: [String],
      default: [],
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
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one language",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "A course must have at least one tag",
      },
    },
    subtitles: {
      type: [String],
      default: null,
      required:
        "As professional platfrom, a course must have at least one subtitle",
    },
    requirements: {
      type: String,
      default: null,
      required: "A course must have at least one requirement",
    },
    description: {
      type: String,
      default: null,
      required: [true, "A course must have a descriptionnn"],
    },
    targetAudience: {
      type: String,
      default: null,
      required: [true, "A course must target specific audience"],
    },

    // whatYoulLearn: { type: [String], default: [] },
    modules: {
      type: [moduleSchema],
      default: [],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "A course must contain at least one module",
      },
    },
    customers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    promotions: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    photo: String,
    price: { type: Number, defualt: 0 },
    enrolledStudentsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    lastUpdatedAt: Date,
    status: {
      type: Boolean,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
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
