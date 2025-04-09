const express = require("express");
const { authUser } = require("../middlewares/auth");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const USER_SAFE_DATA = ["firstName" , "lastName" , "age" , "photoUrl" , "about" , "gender"];

//All the request received which they were interested 
userRouter.get("/user/requests/received" , authUser , async( req , res)=>{

try{
   
    const loggedUser = req.user._id;

    const findAllInterestedUser = await ConnectionRequest.find({
        toUserId : loggedUser,
        status : "interested"
    }).populate( "fromUserId" , USER_SAFE_DATA)  // Helps in finding the data of that partiocaular id instantly

    if(!findAllInterestedUser){
        return res.status(500).send("You dont have any pending request")
    }

    res.status(200).json({
        message : "Your requests are",
        data : findAllInterestedUser
    })
}catch(err){
         res.send(" Dont have request" + err.message)
}
})


// The connections they have made
userRouter.get("/user/connections" , authUser , async (req , res)=>{

     try{
        const loggedUser = req.user._id;

        const findAllConnections = await ConnectionRequest.find({
            $or : [ {fromUserId : loggedUser , status : "accepted"} ,{ toUserId : loggedUser , status : "accepted"}]
        }).populate("fromUserId" , USER_SAFE_DATA).populate( "toUserId" , USER_SAFE_DATA);

        if(!findAllConnections){
            res.status(400).send("connection not found")
        }

        const data = findAllConnections.map((field)=>{
            if(field.fromUserId._id.toString() === loggedUser.toString()){
                return field.toUserId;
            }
            return field.fromUserId;
        })

        res.json({message : "Here are you connections" , data})

     }catch(err){
        res.send("You dont have connection" + err.message)
     }

})

//Get all the feed
userRouter.get("/feed" , authUser , async(req , res) =>{

    try{
        const loggedUser = req.user._id;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        //People to avoid
        const connectionExist = await ConnectionRequest.find({
            $or : [{fromUserId: loggedUser} ,{toUserId : loggedUser}]
        }).select( " fromUserId toUserId ");

        const hideUser = new Set();
        connectionExist.forEach((data)=>{
            hideUser.add(data.fromUserId.toString())
            hideUser.add(data.toUserId.toString())
        })

        const feedUser = await User.find({
          $and: [
            { _id: { $nin: Array.from(hideUser) } },
            { _id: { $ne: loggedUser._id } },
          ],
        })
          .select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);

          res.json({ data: feedUser });

    }catch(err){
        res.send("Feed fetching not available" + err.message)
    }
})




module.exports = userRouter;

