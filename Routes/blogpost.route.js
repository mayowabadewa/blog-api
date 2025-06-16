const express = require('express');
const Router = express.Router();

const PostController = require('../controllers/blogpost.controller');

const userMiddleware = require('../middlewares/user.middleware');

Router.get('/myblogs',userMiddleware.AuthorizeUser, PostController.GetOwnBlogPosts)

Router.get('/', PostController.GetAllPosts);
Router.get('/:id', PostController.GetABlogPost);

Router.use(userMiddleware.AuthorizeUser);

Router.post('/', PostController.CreatePost);
Router.delete('/:id', PostController.DeletePost);

module.exports = Router;

