const express = require("express");
const requestRouter = express.Router();

const {auth} = require("../middlewares/auth");

requestRouter.post("/sendConnection",auth, async(req, res)=>{
    try{
        const user = req.user;
        console.log("Sending Connection request");
        res.send("Connection Sent by " + user.firstName);
    }
    catch(err){
        res.status(404).send("Something is wrong");
    }
});

module.exports = requestRouter;