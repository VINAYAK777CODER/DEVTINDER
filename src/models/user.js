// Importing required modules
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Defining the user schema with validation and default values
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 30 ,indexindex: true}, // for string minLength is used and for number min is used
    lastName: { type: String },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      unique:true,
      lowercase: true,
      required: true,
    }, // should not be same
    password: { type: String, required: true }, // compulsory
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data us not valid");
        }
      },
    },
    photo_url: {
      type: String,
      default:
        "https://www.aquasafemine.com/wp-content/uploads/2018/06/dummy-man-570x570.png",
    },
    about: { type: String, default: "This is default description of the user" },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("maximum 10 skills allowed");
        }
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Instance method to generate JWT token for the user
userSchema.methods.getJWT = async function () {
  // you can't use here arrow function ,reason find out youself
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "mySecr$tk@y1", {
    expiresIn: "1D",
  });
  return token;
};

// Instance method to validate user's password using bcrypt
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = bcrypt.compare(passwordInputByUser, hashPassword);
  return isPasswordValid;
};

// Creating a model from the schema mongoose.model("<ModelName>", schema)).
const user = mongoose.model("User", userSchema);

// Exporting the model for use in other parts of the application
module.exports = user;
// or module.exports=mongoose.model("User",userSchema);
