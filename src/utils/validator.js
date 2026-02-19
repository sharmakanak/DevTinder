const validator = require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, phoneNo } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    }
    if (!phoneNo){
        throw new error("Phone Number required");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Create a strong password")
    }
}

const validateLoginData = (req) => {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
        throw new Error("Email and password is required");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("You are not registered");
    }
    return true;
}

const validateProfileEdit = (req) => {
    const allowedEditField = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl"
    ]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditField.includes(field));

    return isEditAllowed;
}
module.exports = { validateSignUpData, validateLoginData, validateProfileEdit };