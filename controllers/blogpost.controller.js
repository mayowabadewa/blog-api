const BlogPostService = require('../services/blogpost.service');

const CreatePost = async (req, res) => {
  const user = req.user; // Assuming user is set in middleware
  const payload = req.body;
  console.log(user, payload);

  const response = await BlogPostService.CreatePost({
    user,
    payload
  });

  res.status(response.status).json({ response });
};

module.exports = {
  CreatePost
};