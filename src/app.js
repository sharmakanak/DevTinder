const express = require('express');
const app = express();

// app.use("/user", (req, res)=>{
//     res.send("Hello from user")
// })

// app.use("/test", (req, res)=>{
//     res.send("Hello from tester....")
// })

app.get("/user/:id/:name", (req, res)=>{
    const param = {...req.params};
    console.log(param);
    res.send({
    name :  'kanak',
    age : '19',
    city : 'haridwar'})
})
// app.get("/me", (req, res)=>{
//     const query = {...req.query};
//     console.log(query);
//     res.send({
//     name :  'kanak',
//     age : '19',
//     city : 'haridwar'})
// })

// app.post("/me", (req, res)=>{
//     res.send("Data successfully saved");
// })
app.listen(3000, ()=>{
    console.log("Hello xyz ");
});

app.get("/hello", (req, res)=>{
    res.send("Just shut up I'm tired of you!!!!")
})

app.delete("/hello", (req, res)=>{
    res.send("Deleted successfully");
})
//s-2 e-4 t-29:06