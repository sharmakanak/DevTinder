const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

//read the json data convert/parse in js format
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB()
    .then(()=>{
        console.log("hello");
        //first databse connection should be there then we should listen to the server
        app.listen(1500, ()=>{
        console.log("server is running..");
    })
    })
    .catch((err)=>{
        console.error("error");
    })

