const express = require("express");
const photoUploadRouter = express.Router();
const cloudinary = require("../config/cloudinary");
const { auth } = require("../middlewares/authUser");


photoUploadRouter.post("/sign", auth, (req, res) => {
    try {
        const timestamp = Math.round(Date.now() / 1000);
        const folder = req.body.folder || "dev-tinder";

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            success: true,
            timestamp,
            signature,
            folder,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Signature generation failed: " + err.message });
    }
});


photoUploadRouter.post("/save-url", auth, async (req, res) => {
    try {
        const { photoUrl } = req.body;

        if (!photoUrl || typeof photoUrl !== "string") {
            return res.status(400).json({ success: false, message: "A valid photoUrl is required" });
        }

        // Only accept URLs from Cloudinary to prevent arbitrary URL injection
        if (!photoUrl.startsWith("https://res.cloudinary.com/")) {
            return res.status(400).json({ success: false, message: "URL must be a Cloudinary URL" });
        }

        req.user.photoUrl.push(photoUrl);
        await req.user.save();

        res.status(200).json({
            success: true,
            message: "Photo saved successfully",
            photoUrl,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to save photo URL: " + err.message });
    }
});

module.exports = photoUploadRouter;