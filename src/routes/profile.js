const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");



profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Remove sensitive fields before sending
    const { password, tokens, ...safeUser } = user.toObject();

    res.status(200).json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


// update the data from the user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const dataToUpdate = req.body;

    const allowedFields = ["firstName","lastName","skills", "photo_url", "about", "gender","age"];

    // Validate update fields
    const isEditAllowed = validateEditProfileData(req);

    if (!isEditAllowed) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid fields for update. Only 'skills', 'photo_url', 'about','age','firstName','lastName' and 'gender' can be updated.",
      });
    }

    // Limit number of skills
    if (dataToUpdate?.skills && dataToUpdate.skills.length > 10) {
      return res.status(400).json({
        status: "error",
        message: "Maximum 10 skills are allowed.",
      });
    }

    // Update only allowed fields
    Object.keys(dataToUpdate).forEach((key) => {
      if (allowedFields.includes(key)) {
        loggedInUser[key] = dataToUpdate[key];
      }
    });

    await loggedInUser.save();

    res.status(200).json({
      status: "success",
      message: `${loggedInUser.firstName} updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
});



// for changing the password
profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    // Check if both old and new passwords are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new passwords are required" });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Prevent same old and new password
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: "New password must be different from old password" });
    }

    // Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ error: "New password is not strong enough" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = profileRouter;
