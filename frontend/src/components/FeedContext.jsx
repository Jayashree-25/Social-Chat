import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

console.log("AuthContext imported:", AuthContext);

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Fetch all posts from backend on mount
  useEffect(() => {
    if (!currentUser) {
      console.warn("No current user, feed functionality limited");
      setPosts([]); // Reset posts when no user
      return;
    }

    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      console.log("FetchPosts token:", token); // Debug token
      if (!token) {
        console.warn("No token available, skipping post fetch");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched posts:", response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error("Invalid posts data from server:", response.data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setPosts([]);
      }
    };

    fetchPosts();
  }, [currentUser]); // Re-fetch if currentUser changes

  const addPost = async (newPost) => {
    const token = localStorage.getItem("token");
    console.log("AddPost token:", token); // Debug token
    if (!token) {
      console.warn("No token available, cannot add post");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        {
          text: newPost.text,
          images: newPost.images || [],
          username: currentUser?.username, // Add username to payload if required
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added post response:", response.data);
      if (response.data && response.data.id) {
        setPosts((prevPosts) => [response.data, ...prevPosts]);
      } else {
        console.error("Invalid post data from server:", response.data);
      }
    } catch (err) {
      console.error("Failed to add post:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        console.warn("Unauthorized: Token might be invalid. Consider logging out or refreshing token.");
        // Optionally clear token: localStorage.removeItem("token");
        // Or trigger a logout: if you have a logout function from AuthContext
      }
    }
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, cannot delete post");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Failed to delete post:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
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
        { username: username.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response:", response.data);
      if (response.data.likes && Array.isArray(response.data.likes)) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: response.data.likes } : post
          )
        );
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
        { text }, // Changed: Backend gets username from token, so we only need to send the text
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response for comment:", response.data);

      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? response.data : post
          )
        );
      }
      else {
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

  const deleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, cannot delete comment");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Deleted comment response:", response.data);

      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? response.data : post
          )
        );
      }
    } catch (err) {
      console.error("Failed to delete comment:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const editComment = async (postId, commentId, text) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, cannot edit comment");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/comment/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? response.data : post
          )
        );
      }
    } catch (err) {
      console.error("Failed to edit comment:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const editPost = async (postId, text) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available, cannot edit post");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Edited post response:", response.data);
      if (response.data && response.data.id) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? response.data : post))
        );
      }
    } catch (err) {
      console.error("Failed to edit post:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
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