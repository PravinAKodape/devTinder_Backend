const express = require("express");

const profileRouter = express.Router()

const {authUser} = require("../middlewares/auth");

const {validateEditProfileData} = require("../utils/validateSignUpData")



// Get profile after signup
profileRouter.get("/profile/view" , authUser , async (req, res)=>{
    try{
      const user = req.user;
   
      res.send(user);
    }catch(err){
     res.status(500).send("Bad request" + err.message)
    }
   });


profileRouter.patch("/profile/edit" , authUser , async (req , res)=>{
    try{

      if(!validateEditProfileData(req)){
        return res.status(400).json({ message: "Requested items can not be edited , please change!" }); 
      }

      const loggedInUser = req.user;
      
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

      await loggedInUser.save();

      res.json({
        message : `${loggedInUser.firstName} your profile updated successfully`,
        data : loggedInUser
      })

    }catch(err){
        res.status(500).send("Edit request can not be successfull")
    }

})

module.exports = profileRouter;