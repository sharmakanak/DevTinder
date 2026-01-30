const express= require("express");
const profileRouter = express.Router();

const {auth} = require("../middlewares/authUser");
const {validateProfileEdit} = require("../utils/validator")
profileRouter.get("/profile/view", auth, async(req, res)=>{
    try{
    const user = req.user;
    res.status(200).json(user);
    }
    catch(err){
        res.status(404).send("Something is wrong");
    }
});

profileRouter.patch("/profile/edit", auth, async(req, res)=>{
    try{
        if(!validateProfileEdit(req)){
            throw new Error("Invalid edit request");
            //return res.status(400).send("");
        };
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.status(200).json(`${loggedInUser.firstName}, Profile updated successfully`);
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = profileRouter;