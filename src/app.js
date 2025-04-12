const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

// This covers practice code from season 2 lecture 1 to 5

// const { userAdmin , contactAdmin  } = require("./middlewares/auth");

// app.get(  "/" , (req , res )=>{  res.send("This is home pagee")});

// app.use( "/user" , userAdmin);
// app.get( "/user/admin" , (req , res )=>{ res.send("This is user admin page")});

// app.use("/contact" , contactAdmin); 
// app.get("/contact/details" , (req , res )=>{ res.send("This is contact page")}); 

// app.post("/user" , (req , res) =>{ res.send("Successfull post user request")})
// app.post("/contact" , (req , res) =>{ res.send("Successfull post conatct request")})


// app.delete( "/user" , (req , res)=>{ res.send(" Delete request done for user")})
// app.delete( "/contact" , (req , res)=>{ res.send(" Delete request done for contact")})


// app.use("/ram" , (req , res  )=>{  console.log( "ram checked");  res.send("This is ram page")}); 
// app.get("/ram/poor" , (req , res )=>{ res.send("This is ram page")}); 

const { connectDB } = require("./config/database");

const User = require("./models/user");

var cookieParser = require('cookie-parser');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");

const http = require("http")
const server = http.createServer(app);

initializeSocket(server)



// ✅ CORS config comes BEFORE routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'], // include PATCH and OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// ✅ Handle preflight OPTIONS requests
app.options('*', cors());

app.use(express.json())  // convert json to javascript object 
app.use(cookieParser())  // For reading cookies


app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);

// This are just practice HTTP requests till app.patch"email" hence not added in express Router --> src --> routes--> files
// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const selectedUser = await User.find({ emailId: userEmail });

    if (selectedUser.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(selectedUser);
    }
  } catch (err) {
    res.status(500).send("Bad request");
  }
});

//Get all users on the feed
app.get("/feed", async (req, res) => {
  
    try {
      const selectedUser = await User.find({});
  
      if (selectedUser.length === 0) {
        res.status(404).send("user not found");
      } else {
        res.send(selectedUser);
      }
    } catch (err) {
      res.status(500).send("Bad request");
    }
  });

//Delete user by id 
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const filterId = await User.findOneAndDelete({ _id: userId });
    if (!filterId) {
      res.status(500).send("Could not find id");
    } else {
      res.send(" User deltetd by id successfully!!!");
    }
  } catch (err) {
    res.status(500).send("Bad request");
  }
});

//Update user by id 
app.patch("/user/:userId", async (req, res) => {

  const userId = req.params.userId;
  const data = req.body;


  try {

    //API Validation only certain field update possible
    const ALLOWED_UPDATES = ["photoUrl" , "about" , "gender", "skills" , "age"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
    )
    if(!isUpdateAllowed){
        throw new Error("Update not allowed")
    }
    if (data?.skills?.length > 10){
        throw new Error("Skills can not be more than 10")
    }


    const output = await User.findByIdAndUpdate(userId, data, {
        new: true,             // Returns updated document
        runValidators: true,   // ✅ Enforce validation rules
    });
 
    res.send(" User updated by id successfully!!!");
  } catch (err) {
    res.status(500).send("Bad request");
  }
});


//Update user by emailId
app.patch("/email", async (req, res) => {
  const email = req.body.emailId;
  const data = req.body;

  try {
    const output = await User.findOneAndUpdate({ emailId: email }, data, {
      returnDocument: "before"
    });
    res.send(" User updated by emailid successfully!!!");
  } catch (err) {
    res.status(500).send("Bad request");
  }
});



connectDB()
  .then(() => {
    console.log("Database connection estabilished...");
    server.listen(process.env.PORT, () => {
      console.log("Server is listening on 7777");
    });
  })
  .catch((err) => {
    console.error("Please connect to database...");
  });
