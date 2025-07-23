import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js"; // Add this

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes); // Add this

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
        app.listen(PORT, () => console.log(`Running at port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error(err);
    });