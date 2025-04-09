var jwt = require('jsonwebtoken');
const User = require("../models/user");


const userAdmin = (req , res , next) =>{
    const token = "xyz";
    if(token === "xyz"){ 
    
        next();
    }else{
        res.status(500).send("Unauthorized user")
    }

}


const contactAdmin = (req , res , next) =>{
    const token = "Pravin";
    if(token === "Pravin"){ 
        next();
    }else{
        res.status(500).send("You can not contact")
    }

}

const authUser = async (req , res , next)=>{
  try {
    const cookies = await req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // 🔹 Return added
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Please login!! " + err.message }); // 🔹 Proper error response
  }
}

module.exports = {userAdmin , contactAdmin , authUser};
    