const express = require("express")
const {authUser } = require("../middlewares/auth")
const Chat = require("../models/chat")

const chatRouter = express.Router();


chatRouter.get( "/chat/:toUserId" , authUser , async(req , res)=>{

    const { toUserId} = req.params ;
    const userId = req.user._id;

    try{
        let chat = await Chat.findOne({
            participants : { $all : [ userId , toUserId]}

          }).populate({
             path : 'messages.senderId',
             select : " firstName lastName"
          })

          if(!chat){
            chat = new Chat({
              participants : [ userId , toUserId],
              messages : []
            })
          }

          await chat.save();
          res.send(chat)

    }catch(err){
       console.log(err.message)
    }

})


module.exports = chatRouter;