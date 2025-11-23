const express = require('express');
const app = express();

app.use("/user", (req, res)=>{
    res.send("Hello from user")
})

app.use("/test", (req, res)=>{
    res.send("Hello from tester....")
})

app.use("/hello", (req, res)=>{
    res.send("Just shut up I'm tired of you!!!!")
})

app.listen(3000, ()=>{
    console.log("Hello xyz");
});