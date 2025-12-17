const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
//read the json data convert/parse in js format
app.use(express.json());

app.get("/user", async(req, res)=>{
    const lastUserName = req.body.lastName;
    try{
        const user = await User.find({lastName:lastUserName});
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get("/feed", async(req, res)=>{
    const user = await User.find({});
    try{
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get("/one", async(req, res)=>{
    const lastUserName = req.body.lastName;
    //always return the first one object that matches with the condition
    const user = await User.findOne({lastName: lastUserName})
    try{
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    try{
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})
app.patch("/user", async(req, res)=>{
    
    const data = req.body;
    
    try{
        await User.findByIdAndUpdate(_id, data)
        res.send("User updated successfully");
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})
connectDB()
    .then(()=>{
        app.listen(2000,()=>{
            console.log("Server is running..");
        })
    })
    .catch((err)=>{
        console.error("error")
    })