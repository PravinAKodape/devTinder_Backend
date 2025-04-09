const express = require("express");

const authRouter = express.Router();

const User = require("../models/user");

const {validateSignUpData} = require("../utils/validateSignUpData");

const bcrypt = require('bcrypt');

//Post sign up user  
authRouter.post("/signup", async (req, res) => {

    try {
  
       //validation of data
       validateSignUpData(req);
  
       const { firstName , lastName , emailId , password } = req.body;
  
       //Encrypt the password
       const passwordHash = await bcrypt.hash( password, 10);
  
       //Creating instance of models  
       const user = new User( { firstName , lastName , emailId , password : passwordHash});

      
        // Create JWT token after log in // Also use userSchema methods
        const tokenGeneration = await user.getJWT();
  
        // Send in cookie format the JWT tokens
        res.cookie('token', tokenGeneration , { expires: new Date(Date.now() + 900000)})
  
      await user.save();
      res.status(200).json({ message: "New user added successfully!!!" , data : user });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.emailId) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(400).json({ message: err.message});
    }
  });
  
  
//LogIn user  
authRouter.post("/login", async (req, res) => {
  
    try {
      const { emailId , password} = req.body;

      const user = await User.findOne({ emailId : emailId});
      if(!user){
        return res.status(404).json({ message: "User not found" }); // 🔹 Return added
      }
  
      // userSchema methods
      const isPasswordValid = await user.validatePassword(password);
      
      if (isPasswordValid) {
  
        // Create JWT token after log in // Also use userSchema methods
        const tokenGeneration = await user.getJWT();
  
        // Send in cookie format the JWT tokens
        res.cookie('token', tokenGeneration , { expires: new Date(Date.now() + 900000)})
  
        res.send(user);
      } else {
        return res.status(401).json({ message: "Please login" });
      }
    } catch (err) {
      res.send("Invalid creditials :" + err.message);
    }
  });


//Logout user
authRouter.post("/logout" , async (req , res)=>{
    res.cookie("token" , null ,{ expires: new Date(Date.now())}).send("Logout successfull!!")
})

  module.exports = authRouter;