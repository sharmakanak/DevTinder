const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    age: {
        type: Number
    },
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;