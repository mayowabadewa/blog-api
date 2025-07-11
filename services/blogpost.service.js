const BlogPostModel = require("../models/blogpost.model");

const CreatePost = async ({ user, payload }) => {
  try {
    const post = await BlogPostModel.create({
      title: payload.title,
      description: payload.description,
      tags: payload.tags,
      author: user.first_name + " " + user.last_name,
      authorId: user._id,
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

const GetAllPosts = async ({
  author,
  title,
  tags,
  page = 1,
  order_by = "createdAt",
  order = "desc",
  search,
}) => {
  const filter = { state: "published" };
  // Basic filters
  if (author) filter.author = author;
  if (title) filter.title = title;
  if (tags && Array.isArray(tags)) filter.tags = { $in: tags };

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: searchRegex },
      { author: searchRegex },
      { content: searchRegex },
    ];
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  // Allowed fields to sort by
  const allowedSortFields = ["read_count", "reading_time", "createdAt"];
  const sortField = allowedSortFields.includes(order_by)
    ? order_by
    : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  try {
    const publishedblogs = await BlogPostModel.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalCount = await BlogPostModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      success: true,
      message: "Posts retrieved successfully",
      data: publishedblogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
      sorting: {
        order_by: sortField,
        order: sortOrder === 1 ? "asc" : "desc",
      },
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

const GetABlogPost = async (id) => {
  console.log(id);
  try {
    const post = await BlogPostModel.findByIdAndUpdate(
      { _id: id, state: "published" },
      { $inc: { readCount: 1 } },
      { new: true, runValidators: true }
    );
    if (!post) {
      return {
        status: 404,
        success: false,
        message: "Post not found",
        data: null,
      };
    }
    return {
      status: 200,
      success: true,
      message: "Blog retrieved successfully",
      data: post,
    };
  } catch (error) {
    console.error(
      "Error retrieving blog post and incrementing read count:",
      error
    );

    return {
      status: 500,
      success: false,
      message: "An internal server error occurred.",
      error: error.message,
    };
  }
};

const DeletePost = async (postId, userId) => {
  console.log("Deleting post with ID:", postId, "by user ID:", userId);
  try {
    const post = await BlogPostModel.findById(postId);
    if (!post) {
      return {
        status: 404,
        success: false,
        message: "Post not found",
      };
    }

    if (post.authorId !== userId) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to delete this post",
      };
    }

    await BlogPostModel.deleteOne({ _id: postId });
    return {
      status: 200,
      success: true,
      message: "Post deleted successfully",
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

const GetOwnBlogPosts = async (userId, state, page, limit) => {
  const filter = { authorId: userId };

  if (state === "published" || state === "draft") {
    filter.state = state;
  }

  const skip = (page - 1) * limit;

  const [blogs, totalCount] = await Promise.all([
    BlogPostModel.find(filter).skip(skip).limit(limit).exec(),
    BlogPostModel.countDocuments(filter).exec(),
  ]);

  return { blogs, totalCount };
};

const UpdatePost = async (postId, userId, updateData) => {
  try {
    const post = await BlogPostModel.findById(postId);

    if (!post) {
      return {
        status: 404,
        success: false,
        message: "Post not found",
      };
    }

    if (post.authorId !== userId) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to update this post",
      };
    }

    // Fields that can be updated
    const allowedUpdates = ["title", "description", "tags", "body", "state"];
    let hasChanges = false;

    for (const key of allowedUpdates) {
      if (updateData.hasOwnProperty(key) && post[key] !== updateData[key]) {
        post[key] = updateData[key];
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return {
        status: 200,
        success: true,
        message: "No changes detected to update.",
        data: post,
      };
    }

    // The pre-save hook on the model will recalculate readingTime if 'body' is changed.
    // It will also validate 'state' against the enum.
    const updatedPost = await post.save();

    return {
      status: 200,
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    };
  } catch (error) {
    if (error.name === "ValidationError") {
      return {
        status: 400,
        success: false,
        message: "Validation Error: " + error.message,
        error: error.errors,
      };
    }
    return {
      status: 500,
      success: false,
      message: "Internal server error while updating post",
      error: error.message,
    };
  }
};

module.exports = {
  CreatePost,
  GetAllPosts,
  GetABlogPost,
  DeletePost,
  GetOwnBlogPosts,
  UpdatePost,
};
