const express = require("express");
const app = express();

app.get(  "/" , (req , res )=>{ res.send("This is home pagee")});

app.get( "/user" , (req , res )=>{ res.send("This is user page")});

app.get("/contact" , (req , res )=>{ res.send("This is contact page")});

app.listen(7777 , ()=> {console.log( "Server is listening on 7777")} )