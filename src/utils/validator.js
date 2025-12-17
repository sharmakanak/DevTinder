const validator = require("validator");
const validateSignUpData = (req)=>{
    const{firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Create a strong password")
    }
}

const validateLoginData = (req)=>{
    const{emailId, password} = req.body;
    if(!emailId || !password){
        throw new Error("Email and password is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("You are not registered");
    }
}
module.exports ={validateSignUpData, validateLoginData};