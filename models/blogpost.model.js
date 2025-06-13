const mongoose = require("mongoose");
import { nanoid, customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
constmongoosePaginate = require("mongoose-paginate-v2");

const blogpostShema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
      user_id: String,
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
    _id: false,
  }
);

blogpostShema.plugin(mongoosePaginate);

const BlogPostModel = mongoose.model("BlogPost", blogpostShema);
module.exports = BlogPostModel;
