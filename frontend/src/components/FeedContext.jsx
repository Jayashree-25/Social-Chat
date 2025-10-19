import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext({
  currentUser: null,
});

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Fetch all posts from backend when currentUser is valid
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      console.log("Checking fetch - Token:", token, "CurrentUser:", currentUser);
      if (!token || !currentUser || !currentUser.username) {
        console.warn("Invalid token or currentUser, skipping fetch. Token:", token, "CurrentUser:", currentUser);
        setPosts([]);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetch successful - Response data:", response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.warn("Unexpected response format, expected array:", response.data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Fetch failed - Error:", err.response?.status, err.response?.data || err.message);
        setPosts([]);
      }
    };

    // Only fetch if currentUser is valid
    if (currentUser && currentUser.username) {
      fetchPosts();
    }
  }, [currentUser]); // Re-run when currentUser changes

  // Handle FormData for file uploads
  const addPost = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setPosts((prevPosts) => [response.data, ...prevPosts]);
      }
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const likePost = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const addComment = async (id, text) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const deleteComment = async (id, commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const editComment = async (id, commentId, text) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${id}/comment/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const editPost = async (id, text) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Failed to edit post:", err);
    }
  };

  return (
    <FeedContext.Provider
      value={{ posts, addPost, deletePost, likePost, addComment, deleteComment, editComment, editPost }}
    >
      {children}
    </FeedContext.Provider>
  );
};