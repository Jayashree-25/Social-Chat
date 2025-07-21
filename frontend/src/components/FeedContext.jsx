import React, { Children, createContext, useState } from "react";

export const FeedContext = createContext();
export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const addPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    }

    const deletePost = (id) => {
        setPosts((prevPosts) => prevPosts.filter((posts) => posts.id != id));
    }

    return (
        <FeedContext.Provider value={{ posts, addPost, deletePost }}>
            {children}
        </FeedContext.Provider>
    );
}

export default FeedContext;