import React, { useContext, useEffect, useState, useRef } from "react"; // Added useRef to imports
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";
import { io } from "socket.io-client";

const MainLayout = () => {
    const { currentUser, loading, error } = useContext(UserContext);
    const { posts, deletePost, likePost, addComment } = useContext(FeedContext);
    const [commentText, setCommentText] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const socketRef = useRef(); // Store socket instance

    useEffect(() => {
        socketRef.current = io("http://localhost:5000"); // Connecting to backend Socket

        socketRef.current.on("receiveMessage", (message) => {
            setChatMessages((prev) => [...prev, message]);
        });

        return () => socketRef.current.disconnect(); // Cleanup on unmount
    }, []);

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

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (chatMessage.trim() && currentUser?.username) {
            const message = {
                user: currentUser.username,
                text: chatMessage,
                time: new Date().toLocaleTimeString(),
            };
            socketRef.current.emit("sendMessage", message); // Send message to server
            setChatMessage(""); // Clear input
        }
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
                                    marginBottom: "1.5rem",
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
                                            height: "260px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "12px",
                                            borderTopRightRadius: "12px",
                                        }}
                                    />
                                ) : null}
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.5" }}>
                                        {post.text || "No text"}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "1rem",
                                            marginTop: "1rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{
                                                border: "none",
                                                background: "linear-gradient(to right, #FF69B4, #FFA500)", // Pink to orange
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "5px",
                                                transition: "background 0.3s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #FF1493, #FF8C00)")}
                                            onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #FF69B4, #FFA500)")}
                                        >
                                            {hasLiked ? "❤️ Liked" : "👍 Like"}
                                        </button>
                                        {/* Removed the redundant Comment button */}
                                    </div>
                                    {likeCount > 0 && (
                                        <p
                                            style={{
                                                marginTop: "0.5rem",
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
                                        <h4 style={{ fontSize: "1.1rem", color: "#333", marginBottom: "0.5rem" }}>
                                            Comments
                                        </h4>
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comment, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundColor: "#f9f9f9",
                                                        padding: "0.75rem",
                                                        marginBottom: "0.75rem",
                                                        borderRadius: "6px",
                                                        borderLeft: "3px solid #1976d2",
                                                    }}
                                                >
                                                    <strong style={{ color: "#1976d2" }}>{comment.user}</strong>
                                                    <span style={{ color: "#555", marginLeft: "0.25rem" }}>:</span>{" "}
                                                    {comment.text}
                                                    <br />
                                                    <small style={{ color: "#888", fontSize: "0.75rem" }}>
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </small>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: "#888", fontStyle: "italic", fontSize: "0.9rem" }}>No comments yet.</p>
                                        )}
                                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    flex: 1,
                                                    padding: "0.5rem",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    fontSize: "0.9rem",
                                                }}
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post.id)}
                                                style={{
                                                    background: "linear-gradient(to right, #FF0000, #FFFF00)",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.5rem 1rem",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "0.9rem",
                                                    transition: "background 0.3s",
                                                }}
                                                onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #CC0000, #FFD700)")}
                                                onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #FF0000, #FFFF00)")}
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
                <h3 style={{ color: "#333", marginBottom: "10px" }}>Chat</h3>
                <div
                    style={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                        marginBottom: "10px",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                    }}
                >
                    {chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "5px",
                                padding: "5px",
                                background: msg.user === currentUser?.username ? "#e0f7fa" : "#f5f5f5",
                                borderRadius: "3px",
                            }}
                        >
                            <strong>{msg.user}</strong>: {msg.text} <span style={{ color: "#888", fontSize: "0.7rem" }}>{msg.time}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "5px" }}>
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: "5px",
                            border: "1px solid #ddd",
                            borderRadius: "3px",
                            fontSize: "0.9rem",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: "linear-gradient(to right, #FF69B4, #FFA500)", // Pink to orange (matching Like button)
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MainLayout;