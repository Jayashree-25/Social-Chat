import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../middleware/verifyToken.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import mongoose from "mongoose";

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social_media_app",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

// POST - Create a new post
router.post("/", verifyToken, upload.array("images", 5), async (req, res) => {
  try {
    console.log("Received:", req.body, req.files, "User:", req.user);
    const { text } = req.body;
    const files = req.files;

    if (!text && (!files || files.length === 0)) {
      return res.status(400).json({ message: "Text or images are required" });
    }

    const imageUrls = files ? files.map((file) => file.path) : [];
    const post = new Post({
      id: new mongoose.Types.ObjectId().toString(), // Use MongoDB ObjectId as string for id
      text,
      images: imageUrls,
      username: req.user.name ? req.user.name.toLowerCase() : "anonymous",
      likes: [],
      comments: [],
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET - Fetch all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Fetch Posts Error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT - Like/Unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Use userId from token
    const post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Like operation error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE - Delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.username.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map((imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`social_media_app/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    await Post.findOneAndDelete({ id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete Post Error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT - Edit a post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.username.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only edit your own posts" });
    }

    post.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit post error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST - Add a comment
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.name, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Comment Operation Error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE - Delete a comment
router.delete("/:id/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own comments" });
    }

    post.comments.pull(req.params.commentId);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Delete comment error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT - Edit a comment
router.put("/:id/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only edit your own comments" });
    }

    comment.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit comment error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;