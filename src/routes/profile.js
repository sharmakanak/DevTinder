const express = require("express");
const profileRouter = express.Router();

const { auth } = require("../middlewares/authUser");
const { validateProfileEdit } = require("../utils/validator")
profileRouter.get("/view", auth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Error fetching profile: " + err.message
        });
    }
});

profileRouter.patch("/edit", auth, async (req, res) => {
    try {
        if (!validateProfileEdit(req)) {
            throw new Error("Invalid edit request");
        };
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName}, Profile updated successfully`
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error: " + err.message
        });
    }
});

module.exports = profileRouter;