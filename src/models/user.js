const mongoose = require("mongoose");
const validator = require('validator');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
       firstName: {
             type: String,
             required : true,
             minLength: 4,
             maxLength: 50
        },
        lastName: {
             type: String,
             minLength: 4,
             maxLength: 50
        },
        emailId: {
             type: String,
             lowercase: true,
             required : true,
             unique : true,
             trim: true,
             validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("EmailId is not valid")
                }
             }
        },
        password: {
             type: String,
             required : true,
             minLength: 4,
             validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Password is not valid")
                }
             }
        },
        age: {
             type: Number,
        },
        gender: {
            type: String,
            validate(value){
                if(!["male", "female" , "other"].includes(value)){
                    throw new Error("Gender data is not valid")
                }
            }
        },
        photoUrl: {
            type: String,
            default : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Photo URL is not valid")
                }
             }
        },
        about:{
            type: String,
            default : "This is the default about section"
        },
        skills:{
            type: [String]
        }
    },
    {
        timestamps : true  // stores time created and updated 
    }
)

//userschema methods are user specific task which can be handle for each user
userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign( {_id : user._id} , "DevTinder@123" , { expiresIn: "2h"});

    return token;
}

userSchema.methods.validatePassword = async function(PasswordFromUser) {
    const user = this;
    const passwordHash = user.password;
  
    const isvalidPassword = await bcrypt.compare(PasswordFromUser, passwordHash);
   
    return isvalidPassword;
}

module.exports = mongoose.model("User" , userSchema)