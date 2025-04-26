const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user"); // capital U for model is better practice

// Middleware to parse JSON body
app.use(express.json());

// ✅ Creating POST API for signup
app.post("/signup", async (req, res) => {
  try {
    // creating a new instance of the User model
    const newUser = new User({
      firstName: "Vinayak",
      lastName: "Keshri",
      emailId: "vkk@gmail.com",
      password: "chal@nikal1234"
    });

    // most mongoose functions return a promise, so use async/await
    await newUser.save(); // Save this user into the MongoDB database

    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in user registration");
  }
});

// ✅ First connect to the database, then start listening
connectDB()
  .then(() => {
    console.log("DB connection is successful");
    app.listen(3000, () => {
      console.log("🚀 Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("❌ Database cannot be connected");
    console.error(err);
  });
