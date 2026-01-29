const express = require ("express");
const userRouter = express.Router();

const {auth} = require("../middlewares/authUser");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const User = require("../models/user")
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

userRouter.get("/user/feed", auth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
           hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ]
        }).select("firstName LastName").skip(skip).limit(limit);;

        res.json({data: users});
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
    
});
module.exports = userRouter;