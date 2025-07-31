import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import { Server } from "socket.io"; // Import socket.io

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected");
        const server = app.listen(PORT, () => console.log(`Running at port ${PORT}`));

        // Initialize socket.io after server is created
        const io = new Server(server, {
            cors: {
                origin: "http://localhost:3000", // Adjust to your frontend URL
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            // Handle chat message
            socket.on("sendMessage", (message) => {
                console.log("Message received:", message);
                io.emit("receiveMessage", message); // Broadcast to all connected clients
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error(err);
    });