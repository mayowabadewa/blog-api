const BlogPostModel = require("../models/blogpost.model");

const CreatePost = async ({ user, payload }) => {
  try {
    const post = await BlogPostModel.create({
      title: payload.title,
      description: payload.description,
      tags: payload.tags,
      author: user.first_name + " " + user.last_name,
      state: payload.state,
      readingTime: payload.readingTime,
      body: payload.body,
    });
    return {
      status: 201,
      success: true,
      message: "Post created successfully",
      data: post,
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    };
  }
};

module.exports = {
  CreatePost,
};
