const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
//read the json data convert/parse in js format
app.use(express.json());
app.post("/signup", async(req, res)=>{
    //console.log(req.body);
    const user = new User(req.body);
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
    try{
        await user.save();
        
        res.send("user added successfully");
    }
    catch(err){
        res.status(500).send("Error"+err.message);
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

