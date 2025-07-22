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

  // Add a new post
  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Delete a post by ID
  const deletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  // Toggle like/unlike based on username
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
    <FeedContext.Provider
      value={{
        posts,
        addPost,
        deletePost,
        likePost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export default FeedContext;
