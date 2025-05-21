const express=require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter=express.Router();
const connectionRequest =require("../models/connectionRequest")
// ✅ Get all pending connection requests for the logged-in user
const SAFE_USER_DATA="firstName lastName photo_url age skills about";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await connectionRequest
  .find({ toUserId: loggedInUser._id, status: "interested" })
  .populate("fromUserId", SAFE_USER_DATA)
  .lean(); // 🔥 performance boost for read-only
  // or populate("fromUserId",["firstName","lastName"])


    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(404).json({ message: "No pending connection requests." });
    }

    return res.status(200).json({
      message: "Pending connection requests fetched successfully.",
      data: pendingRequests,
    });

  } catch (err) {
    console.error("Error fetching pending connections:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all the connection of the user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const acceptedRequests = await connectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", SAFE_USER_DATA)
    .populate("toUserId", SAFE_USER_DATA);

    const data = acceptedRequests.map(row => {
      // If I am the one who sent the request, return toUserId
      if (String(row.fromUserId._id) === String(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data: data });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports=userRouter;

