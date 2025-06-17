const express = require('express');
const Router = express.Router();

const PostController = require('../controllers/blogpost.controller');

const userMiddleware = require('../middlewares/user.middleware');


Router.get('/', PostController.GetAllPosts); // Route for getting all blog posts
Router.get("/myblogs",userMiddleware.AuthorizeUser, PostController.GetOwnBlogPosts) // Route for getting own blog posts

// Router.get('/:id', PostController.GetABlogPost);
Router.get('/:id', PostController.GetABlogPost); // Route for getting a specific blog post by ID
Router.use(userMiddleware.AuthorizeUser);

Router.post('/', PostController.CreatePost); //  Route for creating a new post

Router.put('/:id', PostController.UpdatePost); // Route for updating a post
Router.delete('/:id', PostController.DeletePost); // Route for deleting a post

module.exports = Router;
