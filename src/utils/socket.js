const socket = require("socket.io")
const Chat = require("../models/chat")

const initializeSocket = (server) => {
    const io = socket(server, {
        cors : {
          origin: "http://localhost:5173",
        }
        
      });
      
      io.on("connection", (socket) => {
        // handle events

        socket.on("joinChat" , ({userId, toUserId})=>{
           const roomId = [userId , toUserId].sort().join("_")
           socket.join(roomId)

        })

        socket.on("sendMessage", async({ firstName, userId, toUserId, text }) => {
            const roomId = [userId , toUserId].sort().join("_")

            // save message in db
            try{

              let chat = await Chat.findOne({
                participants : { $all : [ userId , toUserId]}
              })

              if(!chat){
                chat = new Chat({
                  participants : [ userId , toUserId],
                  messages : []
                })
              }

              chat.messages.push({
                senderId : userId,
                text
              })

              await chat.save();


            }catch(err){
              console.log(err)
            }
            io.to(roomId).emit("messageReceived" , {firstName ,text}) 
        });



        socket.on("disconnect" , ()=>{})


      });
}

module.exports = initializeSocket;