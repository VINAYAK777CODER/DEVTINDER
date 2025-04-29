const mongoose = require("mongoose");
// defining a schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 30 }, // for string minLength is used and for number min is used
    lastName: { type: String },
    emailId: {
      type: String,
      unique: true,
      trim: true,
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
  { timestamps: true }
);
const user = mongoose.model("User", userSchema);
module.exports = user;
// or module.exports=mongoose.model("User",userSchema);
