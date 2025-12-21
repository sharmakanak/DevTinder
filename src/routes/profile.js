const express= require("express");
const profileRouter = express.Router();

const {auth} = require("../middlewares/auth");
profileRouter.get("/profile", auth, async(req, res)=>{
    try{
    const user = req.user;
    res.send(user);
    }
    catch(err){
        res.status(404).send("Something is wrong");
    }
});

module.exports = profileRouter;