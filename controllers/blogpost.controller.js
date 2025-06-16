const { parse } = require("dotenv");
const BlogPostService = require("../services/blogpost.service");

const CreatePost = async (req, res) => {
  const user = req.user; // Assuming user is set in middleware
  const payload = req.body;
  console.log(user, payload);

  const response = await BlogPostService.CreatePost({
    user,
    payload,
  });

  res.status(response.status).json({ response });
};



const GetAllPosts = async (req, res) => {
    const { author, title, tags, page } = req.query;
    console.log(req.query)
    const tagsArray = tags ? tags.split(",") : undefined;
    console.log(tagsArray);
    
  const response = await BlogPostService.GetAllPosts({
    author,
    title,
    tags: tagsArray,
    page: parseInt(page, 20),
  });
  res.status(response.status).json({ response });
};

const GetABlogPost = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await BlogPostService.GetABlogPost(id);
    res.status(response.status).json({ response });
  } catch (error) {
    console.error("Error retrieving blog post:", error);
  }
};

const GetOwnBlogPosts = async (req, res) => {
  const userId = req.user._id;
  try {

    const response = await BlogPostService.GetOwnBlogPosts({
      page: parseInt(page, 20),
      userId,
    });
    res.status(response.status).json({ response });
  } catch (error) {
    console.error("Error retrieving own blog posts:", error);
  }
}

const DeletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // Assuming user ID is available in req.user
    const response = await BlogPostService.DeletePost(postId, userId);
    res.status(response.status).json({ response });
  } catch (error) {
    console.error("Error deleting blog post:", error);
  }
}

module.exports = {
  CreatePost,
  GetAllPosts,
  GetABlogPost,
  DeletePost,
  GetOwnBlogPosts
};
