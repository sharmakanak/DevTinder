const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Invalid Email ID: "+ value);
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        // validate(value){
        //     if(value.length<8){
        //         throw new Error("Password must be of 8 characters")
        //     }
        // }
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("Create a strong password");
        //     }
        // }
    },
    phoneNo: {
        type: String,
        required: true,
        validate(value){
            if(value.length !== 10){
                throw new Error("invalid phone number")
            }
        }
    },
    age: {
        type: Number,
        min: 12,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female"].includes(value)){
                throw new Error("Gender not specified");
            }
        }
    },
    about: {
        type: String,
        default: "this is your about section",
    },
    skills: {
        type: [String],
    }
},
{
    //created time and updated time added to database
    timestamps:true,
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;