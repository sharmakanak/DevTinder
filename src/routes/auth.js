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

        res.status(200).json("user added successfully");
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
            "about", "password", "age", "skills", "phoneNo"
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
        res.status(200).json("User updated successfully");
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
    const {emailId, pass} = req.body;
    const user = await User.findOne({emailId});
    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    };

    
    const isPasswordValid = await user.passwordValidationChecking(pass);
    if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token", token,{
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: user,
        });

    }
    else{
        throw new Error("Invalid Cresidentials");
    }
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
})

authRouter.post("/logout", async(req, res)=>{
    console.log("Logout Hit");
    try{
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 0,
            path: "/"
        })
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch{
        res.status(400).json({
            success: false,
            message: "Logout failed",
        });
    }
})
module.exports = authRouter;