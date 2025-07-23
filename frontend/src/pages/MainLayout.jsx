import React, { useContext } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";

const MainLayout = () => {
    const { currentUser } = useContext(UserContext);
    const { posts, deletePost, likePost } = useContext(FeedContext);

    const handleLike = (postId) => {
        if (!currentUser) return;
        likePost(postId, currentUser.username);
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            {/* Feed */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                {posts.length === 0 ? (
                    <p>No posts yet...</p>
                ) : (
                    posts.map((post) => {
                        const hasLiked = post.likes?.includes(currentUser?.username);
                        const likeCount = post.likes?.length || 0;

                        return (
                            <div
                                key={post.id}
                                style={{
                                    maxWidth: "600px",
                                    margin: "0 auto 2rem",
                                    backgroundColor: "#fff",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    position: "relative",
                                }}
                            >
                                {/* Images */}
                                {post.images?.length > 1 ? (
                                    <Carousel images={post.images} />
                                ) : post.images?.length === 1 ? (
                                    <img
                                        src={post.images[0]}
                                        alt="Post"
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                ) : null}

                                {/* Content */}
                                <div style={{ padding: "1.2rem" }}>
                                    <p style={{ fontSize: "0.95rem", color: "#444" }}>{post.text}</p>

                                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{
                                                border: "none",
                                                background: "none",
                                                color: hasLiked ? "#d32f2f" : "#1976d2",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {hasLiked ? "❤️ Liked" : "👍 Like"}
                                        </button>
                                        <button
                                            style={{
                                                border: "none",
                                                background: "none",
                                                color: "#1976d2",
                                                cursor: "pointer",
                                            }}
                                        >
                                            💬 Comment
                                        </button>
                                    </div>

                                    {likeCount > 0 && (
                                        <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.85rem" }}>
                                            {hasLiked
                                                ? likeCount === 1
                                                    ? "You liked this"
                                                    : `You and ${likeCount - 1} others`
                                                : `${likeCount} ${likeCount === 1 ? "person" : "people"} liked this`}
                                        </p>
                                    )}
                                </div>

                                {/* Delete Button */}
                                {post.username === currentUser?.username && (
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            backgroundColor: "#f44336",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Chat Placeholder */}
            <div
                style={{
                    width: "20%",
                    background: "#f9f9f9",
                    padding: "20px",
                    borderLeft: "1px solid #ddd",
                    height: "100vh",
                }}
            >
                <p>Chat goes here...</p>
            </div>
        </div>
    );
};

export default MainLayout;
