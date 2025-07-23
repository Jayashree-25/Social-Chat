// routes/posts.js
import express from "express";
const router = express.Router();

router.put("/:postId/like", (req, res) => {
  const { username } = req.body;
  const { postId } = req.params;
  if (!username) return res.status(400).json({ message: "Username required" });

  // Simulate a post document (replace with MongoDB logic)
  const posts = {}; // In reality, query your database
  if (!posts[postId]) {
    posts[postId] = { likes: [] };
  }
  const post = posts[postId];
  if (!post.likes.includes(username)) {
    post.likes.push(username);
  } else {
    post.likes = post.likes.filter((u) => u !== username);
  }

  res.json({ likes: post.likes });
});

export default router;