const express = require('express');
const Router = express.Router();

const PostController = require('../controllers/blogpost.controller');

const userMiddleware = require('../middlewares/user.middleware');

Router.use(userMiddleware.AuthorizeUser);

Router.post('/', PostController.CreatePost);

module.exports = Router;

