const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async(req, res, next)=>{
    try{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
        success: false,
        message: "Token not found",
        });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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

    return res.status(401).json({
      success: false,
      message: err.message,
    });
}
}
module.exports = {auth}