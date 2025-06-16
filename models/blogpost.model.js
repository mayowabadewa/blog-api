const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const mongoosePaginate = require("mongoose-paginate-v2");

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

const { estimateReadingTime } = require("../services/readingTimeCalculator");

const BlogpostSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    title: {
      type: String,
      required: true,
      trim: true,
      uniquie: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      trim: true,
    },
    authorId: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    readCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: String,
      required: true,
      trim: true,
        default: "0 min",
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

BlogpostSchema.pre("save", function (next) {
  // 'this' refers to the document being saved
  // Only recalculate if the document is new OR if the 'body' field has been modified
  if (this.isNew || this.isModified("body")) {
    this.readingTime = estimateReadingTime(this.body);
  }
  next();
});

BlogpostSchema.plugin(mongoosePaginate);

const BlogPostModel = mongoose.model("blogs", BlogpostSchema);
module.exports = BlogPostModel;
