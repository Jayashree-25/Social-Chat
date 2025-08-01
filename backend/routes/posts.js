import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Verify token
const authenticateToken = (req, res, next) => {
  console.log("Headers:", req.headers);
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET || "jayashree123", (err, user) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(401).json({ message: "Invalid token", error: err.message });
    }
    console.log("Decoded user:", user);
    req.user = user;
    next();
  });
};

// Create Post
router.post("/", authenticateToken, async (req, res) => {
  console.log("POST /api/posts hit", "req.user:", req.user);
  const { text, images } = req.body;
  if (!text && (!images || !images.length))
    return res.status(400).json({ message: "Text or images are required" });

  try {
    if (!req.user || !req.user.name) {
      console.error("User not authenticated or name missing:", req.user);
      return res.status(401).json({ message: "Username not found in token" });
    }

    const post = new Post({
      id: Date.now().toString(),
      text,
      images: images || [],
      username: req.user.name.toLowerCase(), // Normalize to lowercase
      likes: [],
      comments: [],
    });
    const savedPost = await post.save();
    console.log("Post saved:", savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all Posts
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a Post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    console.log("Delete attempt - post:", post, "req.user.name:", req.user.name); // Debug
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.username.toLowerCase() !== req.user.name.toLowerCase()) {
      console.log("Forbidden - username mismatch:", post.username, req.user.name);
      return res.sendStatus(403);
    }
    await Post.findOneAndDelete({ id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Like a post
router.put("/:id/like", authenticateToken, async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  if (!username) return res.status(400).json({ message: "Username required" });

  try {
    let post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const normalizedLikes = post.likes.map((u) => u.toLowerCase());
    const userIndex = normalizedLikes.indexOf(username.toLowerCase());

    if (userIndex === -1) {
      post.likes.push(username);
      console.log(`User ${username} liked post ${id}, new likes:`, post.likes);
    } else {
      post.likes = post.likes.filter((u) => u.toLowerCase() !== username.toLowerCase());
      console.log(`User ${username} unliked post ${id}, new likes:`, post.likes);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a comment
router.post("/:id/comment", authenticateToken, async (req, res) => {
  console.log("Endpoint hit - /api/posts/:id/comment with id:", req.params.id);
  const { username, text } = req.body;
  const { id } = req.params;

  if (!username || !text) return res.status(400).json({ message: "Username and text are required" });

  try {
    let post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: username, text, createdAt: new Date() });
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Comment operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a comment
router.delete("/:id/comment/:commentId", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment || comment.user.toLowerCase() !== req.user.name.toLowerCase()) return res.sendStatus(403);

    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Delete comment error: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Edit a comment
router.put("/:id/comment/:commentId", authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment || comment.user.toLowerCase() !== req.user.name.toLowerCase()) return res.sendStatus(403);

    comment.text = text;
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Edit comment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Edit a post
router.put("/:id", authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post || post.username.toLowerCase() !== req.user.name.toLowerCase()) return res.sendStatus(403);

    post.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;