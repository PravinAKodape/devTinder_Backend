const socket = require("socket.io")

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

        socket.on("sendMessage", ({ firstName, userId, toUserId, text }) => {
            const roomId = [userId , toUserId].sort().join("_")
            io.to(roomId).emit("messageReceived" , {firstName ,text}) 
        });



        socket.on("disconnect" , ()=>{})


      });
}

module.exports = initializeSocket;