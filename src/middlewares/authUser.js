const jwt = require("jsonwebtoken");
const User = require("../models/user");
//creating middleware
const auth = async(req, res, next)=>{
    try{
    //read token from cookie
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
        success: false,
        message: "Token not found",
        });
    }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //get user
    const user = await User.findById(decoded._id);
    if(!user){
        return res.status(401).json({
        success: false,
        message: "User not found",
        });
    }
    req.user = user;
    next();
}
catch(err){
    res.status(401).send("Error: " + err.message);
}
}
module.exports = {auth}