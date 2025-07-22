import React, { useContext } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import FeedContext from "../components/FeedContext";
import Carousel from "../components/Carousel"; // ✅ Added carousel import
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const MainLayout = () => {
    const { currentUser } = useContext(UserContext);
    const { posts, deletePost } = useContext(FeedContext);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            {/* Middle Feed */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                height: "100vh",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
            }}>
                {posts.length === 0 ? (
                    <p>No posts yet...</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                width: "100%",
                                maxWidth: "600px",
                                marginBottom: "2rem",
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                position: "relative",
                            }}
                        >
                            {/* Post Image or Carousel */}
                            {post.images?.length > 1 ? (
                                <Carousel images={post.images} />
                            ) : post.images?.length === 1 ? (
                                <img
                                    src={post.images[0]}
                                    alt="Post"
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        objectFit: "cover",
                                        display: "block"
                                    }}
                                />
                            ) : null}

                            {/* Text Content */}
                            <div style={{ padding: "1.2rem" }}>
                                <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.5" }}>
                                    {post.text}
                                </p>

                                {/* Like & Comment buttons */}
                                <div style={{
                                    marginTop: "1rem",
                                    display: "flex",
                                    gap: "1.5rem",
                                    alignItems: "center",
                                    fontSize: "0.95rem"
                                }}>
                                    <button style={{
                                        background: "none",
                                        border: "none",
                                        color: "#1976d2",
                                        cursor: "pointer",
                                        fontWeight: "500"
                                    }}>
                                        👍 Like
                                    </button>
                                    <button style={{
                                        background: "none",
                                        border: "none",
                                        color: "#1976d2",
                                        cursor: "pointer",
                                        fontWeight: "500"
                                    }}>
                                        💬 Comment
                                    </button>
                                </div>
                            </div>

                            {/* Delete Button */}
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
                        </div>
                    ))
                )}
            </div>

            {/* Right Chat Area */}
            <div
                style={{
                    width: "20%",
                    background: "#f9f9f9",
                    padding: "20px",
                    height: "100vh",
                    overflow: "auto",
                    borderLeft: "1px solid #ddd"
                }}
            >
                <p>Chat goes here...</p>
            </div>
        </div>
    );
};

export default MainLayout;
