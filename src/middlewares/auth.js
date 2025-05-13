const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // FIXED: token, not tokens
    if (!token) {
      throw new Error("Token not found");
    }

    // ✅ Verify token
    const decodedMessage = jwt.verify(token, "mySecr$tk@y1");
    const { _id } = decodedMessage;

    // ✅ Find user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message }); // changed to 401
  }
};

module.exports = { userAuth };
