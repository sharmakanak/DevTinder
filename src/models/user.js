const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        //to fast the searching in DB we use indexing
        //index: true,
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email ID: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Create a strong password");
            }
        }
    },
    phoneNo: {
        type: String,
        default: "",
        validate(value) {
            if (value && !/^\d{10}$/.test(value)) {
                throw new Error("Invalid phone number. Must be 10 digits.");
            }
        }
    },
    age: {
        type: Number,
        min: 12,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female"].includes(value)) {
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
    },
    address: {
        type: String,
        default: "",
    },
    photoUrl: {
        type: [String],
    }
},
    {
        //created time and updated time added to database
        timestamps: true,
    });

//compairing the bcrypted password with the user password
userSchema.methods.passwordValidationChecking = async function (passwordByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);
    return isPasswordValid;
}

//creating token
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
}
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;