import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const storedPosts = localStorage.getItem(`posts_${username}`);
    if (storedPosts) {
      try {
        const parsed = JSON.parse(storedPosts);
        const validPosts = parsed.filter(
          (post) => post && post.id && Array.isArray(post.likes)
        );
        setPosts(validPosts);
      } catch (error) {
        console.error("Error parsing posts from localStorage:", error);
        setPosts([]);
      }
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      localStorage.setItem(`posts_${username}`, JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = (newPost) => {
    const completePost = {
      ...newPost,
      id: newPost.id || Date.now().toString(),
      likes: [],
      comments: [],
    };
    setPosts((prevPosts) => [completePost, ...prevPosts]);
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const likePost = async (postId, username) => {
    if (!username) {
      console.warn("No username provided for like");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        { username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
      console.log("Like successful, updated likes:", response.data.likes);
    } catch (err) {
      console.error("Like failed:", err.response?.data || err.message);
    }
  };

  return (
    <FeedContext.Provider value={{ posts, addPost, likePost, deletePost }}>
      {children}
    </FeedContext.Provider>
  );
};