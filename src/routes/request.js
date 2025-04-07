const express = require("express");

const requestRouter = express.Router();

const {authUser} = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");



//Send connection request
requestRouter.post ("/request/send/:status/:toUserId"  , authUser , async(req, res)=>{

  try{

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //Handling all corner cases
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status not allowed")
    }

    const toUser= await User.findById(toUserId)
    if(!toUser){
     return res.status(404).json({message: " User not found"})
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or : [ {fromUserId , toUserId} , { fromUserId: toUserId , toUserId: fromUserId }]
    });
    if(existingConnectionRequest){
      return res.status(500).json({message: "Already request send, You can not send twice"})
    }

    const newRequest = new ConnectionRequest({ fromUserId , toUserId , status});

    const message = (status === "interested" ) ?  ` ${req.user.firstName} is ${status} in ${toUser.firstName} ` :  ` ${req.user.firstName} ${status} ${toUser.firstName} `;

    await newRequest.save();

    res.status(200).json({
      message : message,
      newRequest
    })

  }catch(err){
    res.status(500).send("Sending request not successful" + err.message )
  }

})

//Review the request
requestRouter.post("/request/review/:status/:requestId", authUser, async(req, res)=>{

  try{
    const loggedInUser = req.user;
    const { status , requestId} = req.params;
  
    //Handling all corner cases
    const allowedStatus = [ "accepted" , "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: "Status not allowed" }); 
    }

    const findConnection = await ConnectionRequest.findOne(
      {
       _id  : requestId,
        toUserId : loggedInUser._id,
        status : "interested"
      }
    )

    if(!findConnection){
      return res.status(404).json({ message: "Could not find ANY CONNECTION REQUEST"})
    }

    findConnection.status = status;
    const data = await findConnection.save();

    res.status(200).json({ message : `${loggedInUser.firstName} ${status} the request` , data})

  }catch(err){
    res.status(500).send("Reviewing request failed" + err.message)
  }
})

module.exports = requestRouter;