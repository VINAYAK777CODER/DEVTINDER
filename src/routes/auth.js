const express=require("express")
const authRouter=express.Router();
const bcrypt = require("bcrypt");
const { validatesignupData } = require("../utils/validation");
const User=require("../models/user")

//signup
authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();


      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, // secure option for auth cookies
        sameSite: "strict", // prevents CSRF
      });

      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports=authRouter;