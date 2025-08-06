import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided or token is malformed" });
        }
        const token = authHeader.split(" ")[1];

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token payload: userId missing" });
        }

        // Find the user in the database using the ID from the token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User associated with this token no longer exists" });
        }

        req.user = user; // Now req.user is the full user object from the database

        next();

    } catch (err) {
        console.error("Token verification error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token signature" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(500).json({ message: "Server error during token authentication" });
    }
};

export default verifyToken;
