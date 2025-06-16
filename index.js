const express = require("express");
require("dotenv").config();
const userRoute = require("./Routes/user.route");
const blogPostRoute = require("./Routes/blogpost.route");
const { connectDB } = require("./database");

PORT = process.env.PORT;

const app = express();

// Connect to the database
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Blog API");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/blogposts", blogPostRoute);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});

