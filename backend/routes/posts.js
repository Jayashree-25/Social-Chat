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

export default router;