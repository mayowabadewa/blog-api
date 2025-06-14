const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generate } = require("shortid");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const Signup = async ({ first_name, last_name, email, password }) => {
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return {
        stautus: 409,
        success: false,
        message: "User already exists",
      };
    }

    const user = await UserModel.create({
      _id: generate(),
      first_name,
      last_name,
      email,
      password,
    });

    const token = generateToken(user._id);
    return {
      status: 201,
      success: true,
      message: "User created successfully",
      data: {
        user,
        token,
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

const Login = async ({ email, password }) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        status: 400,
        success: false,
        message: "User not found",
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return { status: 400, success: false, message: "Invalid password!" };
    }

    const token = generateToken(user._id);

    return {
      status: 200,
      message: "Login successful",
      data: { user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }, token },
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      error: error,
    };
  }
};

module.exports = {
  Signup,
  Login,
};
