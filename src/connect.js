require("dotenv").config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const User = require('./models/user');
const Message = require('./models/message');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    allowedHeaders: "Content-Type, Authorization",
}));

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const photoUploadRouter = require('./routes/photoUpload');

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/photo", photoUploadRouter);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
        methods: ["GET", "POST"],
    },
});

const getRoomId = (userId1, userId2) => {
    return [userId1.toString(), userId2.toString()].sort().join("_");
};

io.use(async (socket, next) => {
    try {
        const rawCookie = socket.handshake.headers.cookie || "";
        const tokenMatch = rawCookie.match(/(?:^|;\s*)token=([^;]*)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("_id firstName lastName");
        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error: " + err.message));
    }
});

io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    socket.join(userId);

    socket.on("joinChat", ({ targetUserId }) => {
        if (!targetUserId) return;
        const room = getRoomId(userId, targetUserId);
        socket.join(room);
    });

    socket.on("sendMessage", async ({ targetUserId, text }) => {
        try {
            if (!targetUserId || !text || !text.trim()) return;

            const message = new Message({
                senderId: socket.user._id,
                receiverId: targetUserId,
                text: text.trim(),
            });
            await message.save();

            const populated = await message.populate([
                { path: "senderId", select: "firstName lastName photoUrl" },
                { path: "receiverId", select: "firstName lastName photoUrl" },
            ]);

            const room = getRoomId(userId, targetUserId);
            io.to(room).emit("receiveMessage", populated);
        } catch (err) {
            socket.emit("error", { message: "Failed to send message: " + err.message });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.firstName} (${userId})`);
    });
});


connectDB()
    .then(() => {
        server.listen(1500, () => {
            console.log("server is running..");
        });
    })
    .catch((err) => {
        console.error("DB connection error:", err.message);
    });
