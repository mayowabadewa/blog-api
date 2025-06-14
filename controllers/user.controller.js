const userService = require('../services/user.service');

const Signup = async (req, res) => {
const payload = req.body;

const response = await userService.Signup({
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    password: payload.password
});

res.status(response.status).json({response});

};

const Login = async (req, res) => {
    const payload = req.body;

    const response = await userService.Login({
        email: payload.email,
        password: payload.password
    });

    res.status(response.status).json({response});
};

module.exports = {
    Signup,
    Login
};