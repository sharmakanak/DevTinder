const express = require ("express");
const userRouter = express.Router();

const {auth} = require("../middlewares/authUser");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
userRouter.get("/user/request/received", auth, async(req, res)=>{
    try{
        const loggedInUser = req.user._id;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser,
            statusOf: "interested" 
        }).populate("fromUserId", ["firstName", "lastName"])
        //populate is used to filter the info of the user 

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        })
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});

userRouter.get("/user/connection", auth, async(req, res)=>{
    try{
        const loggedInUser = req.user._id;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, statusOf: "accepted"},
                {fromUserId: loggedInUser._id, statusOf: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName"]);
        const data =connectionRequest.map((raw)=>raw.fromUserId);
        res.json({data});
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});
module.exports = userRouter;