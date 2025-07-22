import React, { createContext, useEffect, useState } from "react";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    // Load posts from localStorage on initial mount
    useEffect(() => {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
    }, []);

    // Save posts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    const addPost = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    const deletePost = (id) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

    const likePost = (postId, username) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        likes: post.likes?.includes(username)
                            ? post.likes.filter((u) => u !== username) // Unlike
                            : [...(post.likes || []), username], // Like
                    }
                    : post
            )
        );
    };

    return (
        <FeedContext.Provider value={{ posts, addPost, deletePost }}>
            {children}
        </FeedContext.Provider>
    );
};

export default FeedContext;
