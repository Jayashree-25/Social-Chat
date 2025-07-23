import React, { useContext, useEffect } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";

const MainLayout = () => {
    const { currentUser, loading, error } = useContext(UserContext);
    const { posts, deletePost, likePost } = useContext(FeedContext);

    useEffect(() => {
        console.log("MainLayout currentUser:", currentUser);
    }, [currentUser]);

    if (loading) return <p>Loading user...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!currentUser) return <p>User not logged in</p>;

    const handleLike = (postId) => {
        console.log("handleLike called with postId:", postId, "username:", currentUser.username);
        if (!currentUser?.username) {
            console.error("Username is undefined, cannot like post");
            return;
        }
        likePost(postId, currentUser.username);
    };

    const currentUsername = currentUser?.username?.toLowerCase();

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
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
                        const likeList = post.likes?.map((u) => u.toLowerCase()) || [];
                        const hasLiked = currentUsername && likeList.includes(currentUsername);
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
                                {post.images?.length > 1 ? (
                                    <Carousel images={post.images} />
                                ) : post.images?.length === 1 ? (
                                    <img
                                        src={post.images[0]}
                                        alt="Post"
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                ) : null}
                                <div style={{ padding: "1.2rem" }}>
                                    <p style={{ fontSize: "0.95rem", color: "#444" }}>{post.text || "No text"}</p>
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
                                {(post.username?.toLowerCase() === currentUsername || true) && ( // Temporary fallback for testing
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