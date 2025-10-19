import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

// POST - Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      token,
      user: { username: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: existingUser._id, name: existingUser.name, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      token,
      user: { username: existingUser.name, email: existingUser.email },
    });
  } catch (err) {
    console.error("Login error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Current user
router.get("/me", verifyToken, (req, res) => {
  try {
    const user = req.user;
    if (!user.name || !user.email) {
      return res.status(400).json({ message: "User data missing username or email" });
    }
    res.status(200).json({
      user: {
        username: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Me endpoint error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Google OAuth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId: sub });
      await user.save();
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      token,
      user: { username: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google OAuth Error:", err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;