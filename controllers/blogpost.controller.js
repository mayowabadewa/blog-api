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

module.exports = {
  CreatePost,
  GetAllPosts,
  GetABlogPost,
};
