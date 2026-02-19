const express = require("express");
const requestRouter = express.Router();

const { auth } = require("../middlewares/authUser");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

// requestRouter.post("/send/:statusOf/:toUserId", auth, async (req, res) => {
//     try {
//         const fromUserId = req.user._id;
//         const toUserId = req.params.toUserId;
//         const statusOf = req.params.statusOf;

//         const allowedStatus = ["interested", "ignored"];
//         if (!allowedStatus.includes(statusOf)) {
//             return res.status(400).json({ message: "invalid status type: " + statusOf });
//         }

//         //checking if the userId is existing in database or not
//         const toUser = await User.findById(toUserId);
//         if (!toUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User does not exist"
//             });
//         }

//         //checking if request is already had been made or not
//         const existingConnectionRequest = await ConnectionRequestModel.findOne({
//             $or: [
//                 { fromUserId: fromUserId, toUserId: toUserId },
//                 { fromUserId: toUserId, toUserId: fromUserId }
//             ]
//         })
//         if (existingConnectionRequest) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Request already exists"
//             });
//         }

//         //checking if user try to send any request to itself
//         if (fromUserId.toString() === toUserId.toString()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You cannot send request to yourself"
//             });
//         }
//         const connectionRequest = new ConnectionRequestModel({
//             fromUserId,
//             toUserId,
//             statusOf
//         })

//         const data = await connectionRequest.save();
//         res.json({
//             message: "Connection sent successfully",
//             data,
//         });
//     }
//     catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Error sending connection request: " + err.message
//         });
//     }
// });


requestRouter.post("/send/:statusOf/:toUserId", auth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const statusOf = req.params.statusOf;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(statusOf)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status type: " + statusOf
            });
        }

        // ✅ Prevent self request
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send request to yourself"
            });
        }

        // ✅ Check if user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // ✅ Find existing request (both directions)
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {

            // ✅ CASE 1 — Mutual Interest → MATCH 🎯🔥
            if (
                existingConnectionRequest.fromUserId.toString() === toUserId &&
                existingConnectionRequest.toUserId.toString() === fromUserId &&
                existingConnectionRequest.statusOf === "interested" &&
                statusOf === "interested"
            ) {
                existingConnectionRequest.statusOf = "accepted";
                const data = await existingConnectionRequest.save();

                return res.json({
                    success: true,
                    message: "It's a MATCH!",
                    data
                });
            }

            // ✅ CASE 2 — Already Connected
            if (existingConnectionRequest.statusOf === "accepted") {
                return res.status(400).json({
                    success: false,
                    message: "Already connected"
                });
            }

            // ✅ CASE 3 — Retry Allowed (ignored / rejected)
            if (["ignored", "rejected"].includes(existingConnectionRequest.statusOf)) {

                existingConnectionRequest.statusOf = statusOf;
                const data = await existingConnectionRequest.save();

                return res.json({
                    success: true,
                    message: "Request updated",
                    data
                });
            }

            // ✅ CASE 4 — Pending Request Exists
            return res.status(400).json({
                success: false,
                message: "Request already pending"
            });
        }

        // ✅ Fresh Request
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            statusOf
        });

        const data = await connectionRequest.save();

        res.json({
            success: true,
            message: "Connection request sent successfully",
            data
        });

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error sending connection request: " + err.message
        });
    }
});

requestRouter.post("/review/:statusOf/:requestId", auth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { statusOf, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(statusOf)) {
            return res.status(400).json({
                success: false,
                message: "Incorrect status type"
            });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            statusOf: "interested",
            toUserId: loggedInUser,
        });
        if (!connectionRequest) {
            return res.status(400).json({
                success: false,
                message: "Connection request not found or already reviewed"
            });
        }
        connectionRequest.statusOf = statusOf;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection reviewed successfully",
            data,
        });

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error reviewing connection request: " + err.message
        });
    }
})
module.exports = requestRouter;