
const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://Pravink:nbcHaUYKy8vaJrKq@namstenode.r5tbg.mongodb.net/devTinder");
}

module.exports = { connectDB}