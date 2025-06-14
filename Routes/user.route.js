const express = require('express');

const Router = express.Router();

const  UserController = require('../controllers/user.controller');

Router.post('/signup', UserController.Signup);
Router.post('/login', UserController.Login);


module.exports = Router;