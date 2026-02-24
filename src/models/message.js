const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
    },
    { timestamps: true }
);

// Index for efficient chat history lookups
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
