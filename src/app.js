const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user"); // capital U for model is better practice
const { validatesignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const user = require("./models/user");

// Middleware to parse JSON body-beacause server se json data aa raha hai
app.use(express.json());

// ✅ Creating POST API for signup
app.post("/signup", async (req, res) => {
  try {
    // validating the data
    validatesignupData(req);

    // encrypting the password
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photo_url,
      about,
      skills,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      photo_url,
      about,
      skills,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    // console.error("Signup Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: error.message });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");// never say Email is not valid
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ get user by email

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;

    const foundUser = await User.findOne({ emailId: userEmail }); // sabse old vaala return karega if same emailId hai more than one

    if (foundUser.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(foundUser);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// api to find by id and delete the user
app.get("/delete", async (req, res) => {
  try {
    const userId = req.body.userId;
    const restUser = await User.findByIdAndDelete({ _id: userId });
    // const restUser=await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// API -/feed - to get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    // Fetch all users from the database
    const allUsers = await User.find({});

    // If no users are found, send a custom message with a 404 status
    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the users in a structured JSON format with a success status
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (err) {
    // Handle any server-side errors
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
});

// update the data from the user
app.patch("/userUpdate/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    // Allowed fields to update
    const ALLOWED_UPDATES = ["skills", "photo_url", "about", "gender"];

    // Check if only allowed fields are being updated
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid fields for update. Only 'skills', 'photo_url', 'about', and 'gender' can be updated.",
      });
    }

    // Check if skills array exceeds the limit of 10
    if (data?.skills && data.skills.length > 10) {
      return res.status(400).json({
        status: "error",
        message: "Maximum 10 skills are allowed.",
      });
    }

    // Perform the update with validation
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      new: true, // Return the updated user
    });

    // Check if the user is found and updated
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Return successful response
    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    // Handle any unexpected errors
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
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
