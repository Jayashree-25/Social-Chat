import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

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
      // Like: Add username
      post.likes.push(username);
      console.log(`User ${username} liked post ${postId}, new likes:`, post.likes);
    } else {
      // Unlike: Remove username
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
  const { username, text } = req.body;
  const { postId } = req.params;

  if (!username || !text) return res.status(400).json({ message: "Username and text are required" });

  try {
    let post = post.findOne({ id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comment.push({ user: username, text });
    await post.save();
    console.log(`User ${username} commented on post ${postId}, comments:`, post.comments);
    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Comment operation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

export default router;