const express = require("express");
const requestRouter = express.Router();

const {auth} = require("../middlewares/authUser");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:statusOf/:toUserId",auth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const statusOf = req.params.statusOf;

        const allowedStatus =["interested", "ignored"];
        if(!allowedStatus.includes(statusOf)){
            return res.status(400).json({message: "invalid status type: "+ statusOf});
        }

        //checking if the userId is existing in database or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).send("User does not exist");
        }

        //checking if request is already had been made or not
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("Request is already exist")
        }

        //checking if user try to send any request to itself
        if(fromUserId.toString() === toUserId.toString()){
            return res.status(400).send("You can not send request to yourself");
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            statusOf
        })

        const data = await connectionRequest.save();
        res.json({
            message: "Connection sent successfully",
            data,
        });
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});

requestRouter.post("/request/review/:statusOf/:requestId",auth, async(req, res)=>{
    try{
        const loggedInUser = req.user._id;
        const {statusOf, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(statusOf)){
            return res.status(400).send("Incorrect Status");
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            statusOf: "interested",
            toUserId: loggedInUser,
        });
        if(!connectionRequest){
            return res.status(400).send("Incorrect Status");
        }
        connectionRequest.statusOf = statusOf;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection reviewed successfully",
            data,
        });

    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})
module.exports = requestRouter;