import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//Verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authentication"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || "jayashree123", (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  })
};

//Create Post
router.post("/", authenticateToken, async (req, res) => {
  const { text, images } = req.body;
  if (!text && (!images || !images.length))
    return res.status(400).json({ message: "Text or images are required" });

  try {
    const post = new Post({
      text,
      images: images || [],
      username: req.user.username,
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

//GET all Post
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Delete a Post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.username !== req.user.username) return res.sendStatus(403);
    await Post.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:postId/like", async (req, res) => {
  const { username } = req.body;
  const { postId } = req.params;

  if (!username) return res.status(400).json({ message: "Username required" });

  try {
    let post = await Post.findOne({ id: postId });
    if (!post) {
      console.log(`Post ${postId} not found, creating new post`);
      post = new Post({ id: postId, likes: [], username });
      await post.save();
    } else {
      console.log(`Found post ${postId}, likes before update:`, post.likes);
    }

    const normalizedLikes = post.likes.map((u) => u.toLowerCase());
    const userIndex = normalizedLikes.indexOf(username.toLowerCase());

    if (userIndex === -1) {
      post.likes.push(username);
      console.log(`User ${username} liked post ${postId}, new likes:`, post.likes);
    } else {
      post.likes = post.likes.filter((u) => u.toLowerCase() !== username.toLowerCase());
      console.log(`User ${username} unliked post ${postId}, new likes:`, post.likes);
    }

    await post.save();
    console.log(`After save - likes for post ${postId}:`, post.likes);
    res.json({ likes: post.likes });
  } catch (err) {
    console.error("Like operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/:postId/comment", async (req, res) => {
  console.log("Endpoint hit - /api/posts/:postId/comment with postId:", req.params.postId); // Confirm route hit
  const { username, text } = req.body;
  const { postId } = req.params;

  console.log("Received comment request - body:", req.body);
  if (!username || !text) return res.status(400).json({ message: "Username and text are required" });

  try {
    let post = await Post.findOne({ id: postId });
    console.log("Database query result for post:", post);
    if (!post) {
      console.log(`Post ${postId} not found, creating new post`);
      post = new Post({ id: postId, likes: [], comments: [], username: null });
      await post.save();
    } else {
      console.log("Existing post found:", post);
    }
    post.comments.push({ user: username, text });
    console.log("Post before save:", post);
    await post.save();
    console.log(`User ${username} commented on post ${postId}, comments:`, post.comments);
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Comment operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Delete a comment
router.delete("/:id/comment/:commentId", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment || comment.user !== req.user.username) return res.sendStatus(403);

    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Delete comment error: ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Edit a comment
router.put("/:id/comment/:commentId", authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment || comment.user !== req.user.username) return res.sendStatus(403);

    comment.text = text;
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Edit comment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Edit a post
router.put("/:id", authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.username !== req.user.username) return res.sendStatus(403);

    post.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;