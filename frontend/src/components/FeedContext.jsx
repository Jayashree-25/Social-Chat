import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

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
      likes: newPost.likes || [],
      comments: newPost.comments || [],
      username: newPost.username || localStorage.getItem("username"),
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
      console.log("API Response:", response.data);
      if (response.data.likes && Array.isArray(response.data.likes)) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: response.data.likes } : post
          )
        );
        console.log("Like state updated with likes:", response.data.likes);
      } else {
        console.error("Like operation failed, no valid likes array in response");
      }
    } catch (err) {
      console.error("Like failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const addComment = async (postId, username, text) => {
    if (!username || !text) {
      console.warn("Username and text are required for comment");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { username, text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response for comment:", response.data);
      if (response.data.comments && Array.isArray(response.data.comments)) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, comments: response.data.comments } : post
          )
        );
        console.log("Comment state updated with comments:", response.data.comments);
      } else {
        console.error("Comment operation failed, no valid comments array in response");
      }
    } catch (err) {
      console.error("Comment failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  return (
    <FeedContext.Provider value={{ posts, addPost, likePost, deletePost, addComment }}>
      {children}
    </FeedContext.Provider>
  );
};