const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user"); // capital U for model is better practice
// const { validatesignupData } = require("./utils/validation");
// const user = require("./models/user");
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const { userAuth } = require("./middlewares/auth");
app.use(cookieParser());




// Middleware to parse JSON body-beacause server se json data aa raha hai
app.use(express.json());

const authRouter=require("../src/routes/auth");
const profileRouter=require("../src/routes/profile");
const requestRouter=require("../src/routes/requests");
const userRouter=require("../src/routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);









// update the data from the user
// app.patch("/userUpdate/:userId", async (req, res) => {
//   try {
//     const userId = req.params?.userId;
//     const data = req.body;

//     // Allowed fields to update
//     const ALLOWED_UPDATES = ["skills", "photo_url", "about", "gender"];

//     // Check if only allowed fields are being updated
//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );

//     if (!isUpdateAllowed) {
//       return res.status(400).json({
//         status: "error",
//         message:
//           "Invalid fields for update. Only 'skills', 'photo_url', 'about', and 'gender' can be updated.",
//       });
//     }

//     // Check if skills array exceeds the limit of 10
//     if (data?.skills && data.skills.length > 10) {
//       return res.status(400).json({
//         status: "error",
//         message: "Maximum 10 skills are allowed.",
//       });
//     }

//     // Perform the update with validation
//     const updatedUser = await User.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//       new: true, // Return the updated user
//     });

//     // Check if the user is found and updated
//     if (!updatedUser) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found.",
//       });
//     }

//     // Return successful response
//     res.status(200).json({
//       status: "success",
//       message: "User updated successfully.",
//       data: updatedUser,
//     });
//   } catch (err) {
//     // Handle any unexpected errors
//     console.error(err);
//     res.status(500).json({
//       status: "error",
//       message: "Server error: " + err.message,
//     });
//   }
// });

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
