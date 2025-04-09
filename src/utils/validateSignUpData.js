const validator = require('validator');

const validateSignUpData=(req)=>{

    const {firstName , lastName , emailId , password } = req.body;

    if (!firstName) {
      throw new Error("First Name is not valid");
    } else if (!lastName) {
      throw new Error("Last Name is not valid");
    } else if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password is too weak");
    }

}

const validateEditProfileData =(req)=>{
  const allowedEdits = [ "firstName" , "lastName" , "age", "gender" ,"photoUrl" ,"about" ,"skills"];

  const editRequest = Object.keys(req.body).every((edit)=> allowedEdits.includes(edit))

  return editRequest;
}
module.exports ={validateSignUpData , validateEditProfileData};