const express = require("express");
require("dotenv").config();
const userRoute = require("./Routes/user.route");
const { connectDB } = require("./database");

PORT = process.env.PORT;

const app = express();

// Connect to the database
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to blog api",
    success: true,
  });
});

app.use("/api/v1/users", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});

