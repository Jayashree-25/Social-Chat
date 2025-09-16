import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../middleware/verifyToken.js";
import cloudinary from "../config/cloudinary.js"; // Adjust the path if necessary
import multer from "multer";
import fs from "fs"; // Node.js built-in file system module

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temporary storage location

// Create Post
router.post("/", verifyToken, async (req, res) => {
  const { text } = req.body;
  const files = req.files;
  if (!text && (!files || files.length === 0)) {
    return res.status(400).json({ message: "Text or images are required" });
  }

  try {
    const imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "social_media_app",
        });
        imageUrls.push(result.secure_url);

        // Delete the temporary file
        fs.unlinkSync(file.path);
      }
    }

    const post = new Post({
      id: Date.now().toString(),
      text,
      images: imageUrls,
      username: req.user.name.toLowerCase(),
      likes: [],
      comments: [],
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all Posts
router.get("/", verifyToken, async (req, res) => {
  try {
    // Sort by creation date, newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a Post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.username.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
    }
    await Post.findOneAndDelete({ id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Like/Unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  const { id } = req.params;
  const username = req.user.name.toLowerCase(); // Get username from the verified token

  try {
    let post = await Post.findOne({ id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const normalizedLikes = post.likes.map((u) => u.toLowerCase());
    const userIndex = normalizedLikes.indexOf(username);

    if (userIndex === -1) {
      post.likes.push(req.user.name);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a comment
router.post("/:id/comment", verifyToken, async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const username = req.user.name;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    let post = await Post.findOne({ id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: username, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Comment operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a comment
router.delete("/:id/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the logged-in user is the owner of the comment
    if (comment.user.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own comments" });
    }

    post.comments.pull(req.params.commentId);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Delete comment error: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Edit a comment
router.put("/:id/comment/:commentId", verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
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
    console.error("Edit comment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Edit a post
router.put("/:id", verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.username.toLowerCase() !== req.user.name.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden: You can only edit your own posts" });
    }

    post.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
