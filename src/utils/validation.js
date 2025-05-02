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

module.exports = { validatesignupData };
