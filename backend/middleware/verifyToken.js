import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or token is malformed" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload: userId missing" });
    }
    req.user = decoded; // Only sets userId (and name for login tokens)
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(500).json({ message: "Server error during token authentication" });
  }
};

export default verifyToken;