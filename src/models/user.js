const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    age: {
        type: Number
    },
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;