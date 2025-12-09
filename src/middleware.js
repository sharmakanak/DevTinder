const express = require('express');
const app = express();

//correct way to handle error is using try catch
app.get("/", (req, res)=>{
    try{
        throw new Error("jdsjs");
    }
    catch(err){
        res.status(500).send("Some error occur");
    }
})
// app.use("/", (err, req, res, next)=>{
//     if(err){
//     res.status(500).send("Something went wrong");
//     }
//     else{
//         next();
//     }
// })
// app.get("/user", (req, res, next)=>{
//     //res.send("Response 1");
//     next();
// },
//     (req, res, next)=>{
//         //res.send("Response 2");
//         next();
//     },
//     (req, res)=>{
//         res.send("Response 3");
//     }
// )
app.listen(1550, ()=>{
    console.log("server is running...");
})