const express=require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter=express.Router();

// sending the connection request
requestRouter.post("/sentConnectionRequest",userAuth,(req,res)=>{
 try{ const user=req.user;
  console.log("sending the connection request");
  res.send(user.firstName +" "+"has send the connection request");}
  catch(error)
  {
    res.status(401).json({error:error.message});
  }

})
module.exports=requestRouter;