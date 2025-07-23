import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

// POST - REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { username: newUser.name, email: newUser.email }, // Use name as username
    });
  } catch (err) {
    console.error("Register error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare entered password with hashed one
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: { username: existingUser.name, email: existingUser.email }, // Use name as username
    });
  } catch (err) {
    console.error("Login error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Current logged-in user
router.get("/me", verifyToken, (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user: {
        username: user.name || user.email, // Fallback to email if name is missing
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Me endpoint error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST - Google OAuth Route
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    console.log("Received Google Credential:", credential);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId: sub,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: { username: user.name || user.email, email: user.email }, // Use name or email as username
    });
  } catch (err) {
    console.error("Google OAuth Error:", err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;