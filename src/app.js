const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user"); // capital U for model is better practice

// Middleware to parse JSON body-beacause server se json data aa raha hai
app.use(express.json());

// ✅ Creating POST API for signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    // creating a new instance of the User model

    const newUser = new User(req.body);

    // most mongoose functions return a promise, so use async/await
    await newUser.save();

    // Save this user into the MongoDB database

    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in user registration");
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
    const allUser = await User.find({});
    res.send(allUser);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// update the data from the user
app.patch("/userUpdate",async (req,res)=>{
  try{
    const userId=req.body.userId;
    const data=req.body;
    // const updatedUser= await User.findByIdAndUpdate({_id:userId},data);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      data,
      { runValidators: true, new: true } // so that validate function used in schema also work for updation not jsut when new user enterd
    );

    res.send("user Updated Sucessfully ")

  }
  catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}
)

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
