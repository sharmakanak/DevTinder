const express = require("express");
const chatRouter = express.Router();

const { auth } = require("../middlewares/authUser");
const Message = require("../models/message");

chatRouter.get("/:targetUserId", auth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const targetUserId = req.params.targetUserId;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 50;
        limit = limit > 100 ? 100 : limit;
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: loggedInUserId },
            ],
        })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .populate("senderId", ["firstName", "lastName", "photoUrl"])
            .populate("receiverId", ["firstName", "lastName", "photoUrl"]);

        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching chat messages: " + err.message,
        });
    }
});

module.exports = chatRouter;
