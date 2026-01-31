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
    const{emailId, pass} = req.body;
    if(!emailId || !pass){
        throw new Error("Email and password is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("You are not registered");
    }
    return true;
}

const validateProfileEdit = (req)=>{
    const allowedEditFeild = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "about",
        "skills"
    ]

    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFeild.includes(field));

    return isEditAllowed;
}
module.exports ={validateSignUpData, validateLoginData, validateProfileEdit};