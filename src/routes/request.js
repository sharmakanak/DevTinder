const express = require("express");
const requestRouter = express.Router();

const {auth} = require("../middlewares/authUser");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/send/:statusOf/:toUserId",auth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const statusOf = req.params.statusOf;

        const allowedStatus =["interested", "ignored"];
        if(!allowedStatus.includes(statusOf)){
            return res.status(400).json({message: "invalide status type: "+ statusOf});
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("Request is already exist")
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
        res.status(404).send("Something is wrong");
    }
});

module.exports = requestRouter;