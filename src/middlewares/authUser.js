const jwt = require("jsonwebtoken");
const User = require("../models/user");
//creating middleware
const auth = async(req, res, next)=>{
    try{
    //read token from cookie
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    console.log("Token received:", token);
    if(!token){
        return res.status(401).json({
        success: false,
        message: "Token not found",
        });
    }
     console.log("JWT_SECRET:", process.env.JWT_SECRET);
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    //get user
    const user = await User.findById(decoded._id);
    console.log("User from DB:", user);
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
    console.error("AUTH ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: err.message,
    });
}
}
module.exports = {auth}