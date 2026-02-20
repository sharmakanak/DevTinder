const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignUpData, validateLoginData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

authRouter.use(cookieParser());

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, phoneNo, age, gender, about, skills, photoUrl } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            phoneNo,
            password: passwordHash,
            age,
            gender,
            about,
            skills,
            photoUrl
        });

        await user.save();

        const token = await user.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });

        res.json({
            success: true,
            message: "Signup successful",
            data: user
        });

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error: " + err.message
        });
    }
});


authRouter.patch("/signup", async (req, res) => {
    const { _id, ...data } = req.body;
    try {
        //condition to allow the user which feild they can update or not
        const AllowedUpdate = [
            "about", "password", "age", "skills", "phoneNo", "photoUrl"
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            AllowedUpdate.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate(_id, data, {
            returnDocument: "after",
            //to udate the existing data
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log(user);
        res.status(200).json("User updated successfully");
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Update failed: " + err.message
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginData(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        };


        const isPasswordValid = await user.passwordValidationChecking(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/",
            });
            res.status(200).json({
                success: true,
                message: "Login successful",
                user: user,
            });

        }
        else {
            throw new Error("Invalid Credentials");
        }
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
})

authRouter.post("/logout", async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 0,
            path: "/"
        })
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Logout failed: " + err.message,
        });
    }
})
module.exports = authRouter;