const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const {validateSignUpData, validateLoginData} = require("../utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

authRouter.use(cookieParser());

authRouter.post("/signup", async(req, res)=>{
    try{
    validateSignUpData(req);

    //encrypt password(change to hash)
    const {firstName, lastName, emailId, password, phoneNo, age, gender, skills} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //console.log(req.body);
    const user = new User({
        firstName, lastName, emailId, phoneNo, password: passwordHash, age, gender,skills
    });
    
    //instances of model
    // const user = new User({
    //     firstName: "Kanak",
    //     lastName: "Sharma",
    //     emailId: "sharma@2108",
    //     phoneNo: 1234567890,
    //     age: 19
    // });
    // const user = new User({
    //     firstName: "Rudra Pratap",
    //     lastName: "Singh Jat",
    //     emailId: "jat@0111",
    //     phoneNo: 9876543210,
    //     age: 18
    // });
    
        await user.save();

        res.send("user added successfully");
    }
    catch(err){
        res.status(500).send("Error : "+err.message);
    }
});

authRouter.patch("/signup", async(req, res)=>{
    const {_id, ...data} = req.body;
    try{
        //condition to allow the user which feild they can update or not
        const AllowedUpdate = [
            "about", "password", "age", "gender", "skills", "phoneNo"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            AllowedUpdate.includes(k));
        if(!isUpdateAllowed){
            throw new Error ("Update not allowed");
        }
        const user = await User.findByIdAndUpdate(_id, data, {
            returnDocument: "after",
            //to udate the existing data
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
        if(!user){
            return res.status(404).send("User not found");
        }
    }
    catch(err){
        res.status(400).send("Update Failed: "+ err.message);
    }
});

authRouter.post("/login", async(req, res)=>{
    try{
        validateLoginData(req);
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId});
    if(!user){
        throw new Error("Invalid Cresidentials")
    };

    
    const isPasswordValid = await user.passwordValidationChecking(password);
    if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login Successfully");
    }
    else{
        throw new Error("Invalid Cresidentials");
    }
    }
    catch(err){
        res.send("Error: " + err.message);
    }
})
module.exports = authRouter;