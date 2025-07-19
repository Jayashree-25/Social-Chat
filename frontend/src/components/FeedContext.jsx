import React, { Children, createContext, useState } from "react";

export const FeedContext = createContext();
export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const addPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    }

    return (
        <FeedContext.Provider value={{ posts, addPost }}>
            {children}
        </FeedContext.Provider>
    );
}

export default FeedContext;