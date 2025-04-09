const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        required : true ,
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"                               // reference to the User collection
    },

    toUserId :{
        required :true ,
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"                               // reference to the User collection
    },

    status :{
        required : true,
        type: String,
        index : true, // index help to search the field very fast and does not hang DB
        enum : {
            values : [ "ignored" , "interested" , "accepted" , "rejected"],
            message : `{VALUE} is not supported`
        }
    }
},
{
    timestamps: true
});

// Compound index it helps in searching two thing together and make it fast and handle smothly on DB level
// if you put "unique : true" it automatically craetes index but you can also specify by mentioning "index: true"
// ConnectionRequest.findOne({fromUserId , toUserId})  is very fast . It helps when we have so many request and have large DB
connectionRequestSchema.index({
    fromUserId : 1,
    toUserId : 1
})

//pre gets checked just before save the new document or data
connectionRequestSchema.pre('save' , function(next){
    
    const connectingUser = this;
    if(connectingUser.fromUserId.equals(connectingUser.toUserId)){
       throw new Error("Can not send connection to yourself")
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest" , connectionRequestSchema );