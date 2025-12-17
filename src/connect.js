const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validator")
const bcrypt = require("bcrypt");
//read the json data convert/parse in js format
app.use(express.json());
app.post("/signup", async(req, res)=>{
    try{
    validateSignUpData(req);

    //encrypt password(change to hash)
    const {firstName, lastName, emailId, password, phoneNo} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //console.log(req.body);
    const user = new User({
        firstName, lastName, emailId, phoneNo, password: passwordHash
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
})

app.patch("/signup", async(req, res)=>{
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
})

connectDB()
    .then(()=>{
        console.log("hello");
        //first databse connection should be there then we should listen to the server
        app.listen(1500, ()=>{
        console.log("server is running..");
    })
    })
    .catch((err)=>{
        console.error("error");
    })

