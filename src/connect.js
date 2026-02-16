require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors')

//read the json data convert/parse in js format
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    allowedHeaders: "Content-Type, Authorization",
  })
);


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
app.use("/", authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);

connectDB()
    .then(()=>{
        console.log("hello");
        //first database connection should be there then we should listen to the server
        app.listen(1500, ()=>{
        console.log("server is running..");
    })
    })
    .catch((err)=>{
        console.error("error");
    })

