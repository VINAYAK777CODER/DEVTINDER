const express=require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter=express.Router();
const connectionRequest =require("../models/connectionRequest")
const User=require("../models/user")
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

userRouter.get("/feed",userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit=limit>50?50:limit;
    const toSkip = (page - 1) * limit;
    



    // users should see all the cards except 
    // 1-> his own card
    // 2-> his connections
    // 3-> ignored people 
    // 4-> already sent the connection 

    const loggedInUser=req.user;
// sent + connection users
// first we will find the users to hide
    const hideUsersFromFeed=await connectionRequest.find(
      {
        $or:[
          {fromUserId:loggedInUser._id},
          {toUserId:loggedInUser._id}
        ]
      }
    ).select("fromUserId toUserId");

    const uniqueUsersToHide=new Set();
    hideUsersFromFeed.forEach((req)=>{
      uniqueUsersToHide.add(req.fromUserId.toString());
      uniqueUsersToHide.add(req.toUserId.toString());
    })

    uniqueUsersToHide.add(loggedInUser._id.toString()); // Also exclude self

    // console.log(uniqueUsersToHide);
    const usersInFeed=await User.find({
      _id:{ $nin:Array.from(uniqueUsersToHide)},// not in 
    // _id:{ $ne:loggedInUSer._id} // ->id should not equal to ==> if we have to include self in this way but put both in $and
    }).select(SAFE_USER_DATA).skip(toSkip).limit(limit);


   
    res.status(200).json({
      status: "success",
      message: "these are on feed users",
       data: usersInFeed,
    });
  } catch (err) {
    // Handle any server-side errors
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
});


module.exports=userRouter;

