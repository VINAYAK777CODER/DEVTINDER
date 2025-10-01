const validator = require("validator");

const validatesignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name or last name is required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
};
const validateEditProfileData=(req)=>{
    const data = req.body;

    // Allowed fields to update
    const ALLOWED_UPDATES = ["firstName","lastName","skills", "photo_url", "about", "gender","age"];
    // Check if only allowed fields are being updated

    const isEditAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    return isEditAllowed;
}

module.exports = { validatesignupData,validateEditProfileData};
