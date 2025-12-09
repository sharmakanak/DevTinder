const mongoose = require("mongoose");
const connectDB = async()=>{
    mongoose.connect(
        "mongodb+srv://sharmakanak2108:Busy%402108@mongo21.rz2kwlw.mongodb.net/DevTinder" 
    )
}
module.exports = connectDB;
