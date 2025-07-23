import React, { createContext, useState, useEffect } from "react";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            try {
                const parsed = JSON.parse(storedPosts);
                const validPosts = parsed.filter(
                    (post) => post && post.id && Array.isArray(post.likes)
                );
                setPosts(validPosts);
                console.log("Loaded posts:", validPosts);
            } catch (error) {
                console.error("Error parsing posts from localStorage:", error);
                setPosts([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
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

    const likePost = (postId, username) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                const postIdStr = String(post.id); // Ensure consistent ID type
                const inputIdStr = String(postId);
                if (postIdStr === inputIdStr) {
                    const likesArray = Array.isArray(post.likes) ? post.likes : [];
                    const isLiked = likesArray.includes(username);
                    const updatedLikes = isLiked
                        ? likesArray.filter((user) => user !== username)
                        : [...likesArray, username];

                    return { ...post, likes: updatedLikes };
                }
                return post;
            })
        );
    };

    return (
        <FeedContext.Provider value={{ posts, addPost, likePost, deletePost }}>
            {children}
        </FeedContext.Provider>
    );
};
