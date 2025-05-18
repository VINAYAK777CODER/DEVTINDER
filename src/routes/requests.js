const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");

// @route   POST /request/send/:status/:userId
// @desc    Send a connection request from the logged-in user to another user
// @access  Protected
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      // ✅ Allow only specific statuses
      const ALLOWED_STATUS_SEND = ["interested", "ignored"];
      if (!ALLOWED_STATUS_SEND.includes(status)) {
        return res.status(400).json({ error: "Invalid request status." });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ error: "Invalid user ID format." });
      }


      // ✅ Check if the target user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ error: "User not found." });
      }

      

      // 🔐 Prevent duplicate or reverse connection requests
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(409).json({
          error: "A connection request already exists between these users.",
        });
      }

      // ✅ Save the new connection request
      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const savedRequest = await newRequest.save();

      return res.status(201).json({
        message: `${req.user.firstName} has sent a connection request to ${toUser.firstName}.`,
        request: savedRequest,
      });
    } catch (error) {
      console.error("Error sending connection request:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
);



// @route   POST /request/review/:status/:requestId
// @desc    Review (accept/reject) a connection request
// @access  Protected
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    // ✅ Validate allowed review status
    const ALLOWED_STATUS_REVIEW = ["accepted", "rejected"];
    if (!ALLOWED_STATUS_REVIEW.includes(status)) {
      return res.status(400).json({ message: "Status not allowed. Only 'accepted' or 'rejected' are valid." });
    }

    // ✅ Find the original connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    // ✅ Handle not found
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found or already reviewed." });
    }

    // ✅ Update the status
    connectionRequest.status = status;
    const updatedRequest = await connectionRequest.save();

    return res.json({
      message: `Connection request ${status}`,
      data: updatedRequest,
      
    });
  } catch (error) {
    console.error("Error reviewing request:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = requestRouter;
