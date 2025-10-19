import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext({
    currentUser: null
});

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const { currentUser } = useContext(AuthContext);
    
    // Fetch all posts from backend on mount
    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            // This check will depend on the currentUser from the real AuthProvider in your app
            if (!token || !currentUser) {
                setPosts([]);
                return;
            }
            try {
                const response = await axios.get("http://localhost:5000/api/posts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(response.data || []);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setPosts([]);
            }
        };
        fetchPosts();
    }, [currentUser]); 

    // UPDATED to handle FormData for file uploads
    const addPost = async (formData) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.post("http://localhost:5000/api/posts", formData, {
                headers: { Authorization: `Bearer ${token}` }
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
            setPosts((prev) => prev.filter((post) => post._id !== id)); 
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    const likePost = async (postId) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${postId}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? response.data : post
                    )
                );
            }
        } catch (err) {
            console.error("Like failed:", err);
        }
    };

    const addComment = async (postId, text) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/${postId}/comment`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? response.data : post
                    )
                );
            }
        } catch (err) {
            console.error("Comment failed:", err);
        }
    };

    const deleteComment = async (postId, commentId) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/posts/${postId}/comment/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? response.data : post
                    )
                );
            }
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const editComment = async (postId, commentId, text) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${postId}/comment/${commentId}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? response.data : post
                    )
                );
            }
        } catch (err) {
            console.error("Failed to edit comment:", err);
        }
    };

    const editPost = async (postId, text) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${postId}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) => (post._id === postId ? response.data : post))
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

