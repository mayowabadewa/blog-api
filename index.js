const express = require("express");
require("dotenv").config()

PORT = process.env.PORT

const app = express();

app.get("/", (req, res)=> {
    res.status(200).json({
        message: "Welcome to blog api",
        success: true,
    })
});

app.listen(PORT, ()=> {
    console.log(`Server is running on localhost:${PORT}`)
} )