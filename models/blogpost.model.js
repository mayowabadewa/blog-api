const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const mongoosePaginate = require("mongoose-paginate-v2");

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

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

BlogpostSchema.plugin(mongoosePaginate);

const BlogPostModel = mongoose.model("BlogPostModel", BlogpostSchema);
module.exports = BlogPostModel;
