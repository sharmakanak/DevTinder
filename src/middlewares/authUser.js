const jwt = require("jsonwebtoken");
const User = require("../models/user");
//creating middleware
const auth = async(req, res, next)=>{
    try{
    //read token from cookie
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token not found");
    }
    //verify token
    const jwtDecodedMess = await jwt.verify(token, "arti@23490")

    //get user
    const {_id} = jwtDecodedMess;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
}
catch(err){
    res.status(400).send("Error: " + err.message);
}
}
module.exports = {auth}