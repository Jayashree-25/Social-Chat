import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";

const MainLayout = () => {
    const { currentUser, loading, error } = useContext(UserContext);
    const { posts, deletePost, likePost, addComment } = useContext(FeedContext);
    const [commentText, setCommentText] = useState("");

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

    const handleCommentSubmit = (postId) => {
        if (!commentText.trim()) {
            console.warn("Comment text is empty");
            return;
        }
        if (!currentUser?.username) {
            console.error("User not logged in, cannot comment");
            return;
        }
        addComment(postId, currentUser.username, commentText);
        setCommentText(""); // Clear input after submission
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
                    maxWidth: "800px",
                    margin: "0 auto",
                }}
            >
                {posts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>No posts yet...</p>
                ) : (
                    posts.map((post) => {
                        const likeList = post.likes?.map((u) => u.toLowerCase()) || [];
                        const hasLiked = currentUsername && likeList.includes(currentUsername);
                        const likeCount = post.likes?.length || 0;

                        return (
                            <div
                                key={post.id}
                                style={{
                                    maxWidth: "100%",
                                    marginBottom: "2rem",
                                    backgroundColor: "#fff",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
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
                                            borderTopLeftRadius: "12px",
                                            borderTopRightRadius: "12px",
                                        }}
                                    />
                                ) : null}
                                <div style={{ padding: "1.5rem" }}>
                                    <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.5" }}>
                                        {post.text || "No text"}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "1.5rem",
                                            marginTop: "1.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{
                                                border: "none",
                                                background: "linear-gradient(to right, #4CAF50, #1976d2)", // Green to blue gradient
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "5px",
                                                transition: "background 0.3s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #388E3C, #1565c0)")} // Darker green to blue
                                            onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #4CAF50, #1976d2)")}
                                        >
                                            {hasLiked ? "❤️ Liked" : "👍 Like"}
                                        </button>
                                        {/* Removed the redundant Comment button */}
                                    </div>
                                    {likeCount > 0 && (
                                        <p
                                            style={{
                                                marginTop: "0.75rem",
                                                color: "#666",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {hasLiked
                                                ? likeCount === 1
                                                    ? "You liked this"
                                                    : `You and ${likeCount - 1} others`
                                                : `${likeCount} ${likeCount === 1 ? "person" : "people"} liked this`}
                                        </p>
                                    )}

                                    {/* Comment Section */}
                                    <div style={{ marginTop: "1.5rem" }}>
                                        <h4 style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>
                                            Comments
                                        </h4>
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comment, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundColor: "#f9f9f9",
                                                        padding: "1rem",
                                                        marginBottom: "1rem",
                                                        borderRadius: "8px",
                                                        borderLeft: "4px solid #1976d2",
                                                    }}
                                                >
                                                    <strong style={{ color: "#1976d2" }}>{comment.user}</strong>
                                                    <span style={{ color: "#555", marginLeft: "0.5rem" }}>:</span>{" "}
                                                    {comment.text}
                                                    <br />
                                                    <small style={{ color: "#888" }}>
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </small>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: "#888", fontStyle: "italic" }}>No comments yet.</p>
                                        )}
                                        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    flex: 1,
                                                    padding: "0.75rem",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "5px",
                                                    fontSize: "0.95rem",
                                                }}
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post.id)}
                                                style={{
                                                    background: "linear-gradient(to right, #4CAF50, #1976d2)", // Green to blue gradient
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.75rem 1.5rem",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "0.95rem",
                                                    transition: "background 0.3s",
                                                }}
                                                onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #388E3C, #1565c0)")} // Darker green to blue
                                                onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #4CAF50, #1976d2)")}
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {(post.username?.toLowerCase() === currentUsername || true) && (
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            backgroundColor: "#f44336",
                                            color: "white",
                                            border: "none",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background 0.3s",
                                        }}
                                        onMouseOver={(e) => (e.target.style.background = "#d32f2f")}
                                        onMouseOut={(e) => (e.target.style.background = "#f44336")}
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
                    overflowY: "auto",
                }}
            >
                <p>Chat goes here...</p>
            </div>
        </div>
    );
};

export default MainLayout;