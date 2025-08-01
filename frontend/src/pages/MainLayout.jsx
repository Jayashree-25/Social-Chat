import React, { useContext, useEffect, useState, useRef } from "react"; // Added useRef to imports
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";

const MainLayout = () => {
    const { currentUser, loading, error } = useContext(UserContext) || {}; // Default to empty object
    const feedContext = useContext(FeedContext) || {}; // Default to empty object if undefined
    const {
        posts = [], // Default to empty array
        deletePost,
        editPost,
        likePost,
        addComment,
        deleteComment,
        editComment,
    } = feedContext;
    const [commentText, setCommentText] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editPostId, setEditPostId] = useState(null);
    const [editPostText, setEditPostText] = useState("");
    const [showAllComments, setShowAllComments] = useState(null);
    const currentUsername = currentUser?.username?.toLowerCase();

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

    const handleEditComment = (comment, postId) => {
        setEditCommentId(comment.id);
        setEditText(comment.text);
    };

    const handleSaveEditComment = (postId, commentId) => {
        if (!editText.trim()) {
            console.warn("Comment text is empty");
            return;
        }
        if (!currentUser?.username) {
            console.error("User not logged in, can't edit");
            return;
        }
        editComment(postId, commentId, editText);
        setEditCommentId(null);
        setEditText("");
    };

    const handleDeleteComment = (postId, commentId) => {
        if (!currentUser?.username) {
            console.error("Not logged in, can't delete");
        }
        deleteComment(postId, commentId);
    };

    const handleEditPost = (post) => {
        setEditPostId(post.id);
        setEditPostText(post.text || "");
    };

    const handleSaveEditPost = (postId) => {
        if (!editPostText.trim()) {
            console.warn("Edited post text is empty");
            return;
        }
        if (!currentUser?.username) {
            console.error("Not logged in, can't edit");
        }
        editPost(postId, editPostText);
        setEditPostId(null);
        setEditPostText("");
    };

    const handleDeletePost = (postId) => {
        if (!currentUser?.username) {
            console.error("Not logged in, can't delete");
            return;
        }
        deletePost(postId);
    };

    const handleViewAllComments = (post) => {
        setShowAllComments(post);
    };

    const closePopup = () => {
        setShowAllComments(null);
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                    maxWidth: "800px",
                    margin: "0 auto",
                }}
            >
                {posts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666", margin: "5px" }}>No posts yet...</p>
                ) : (
                    posts.map((post) => {
                        const likeList = post.likes?.map((u) => u.toLowerCase()) || [];
                        const hasLiked = currentUsername && likeList.includes(currentUsername);
                        const likeCount = post.likes?.length || 0;
                        const isOwner = post.username?.toLowerCase() === currentUsername;

                        return (
                            <div
                                key={post.id}
                                style={{
                                    maxWidth: "100%",
                                    marginBottom: "10px",
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    position: "relative",
                                    padding: "5px",
                                }}
                            >
                                <div style={{ padding: "5px" }}>
                                    <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>
                                        Posted by: <strong>{post.username}</strong> |{" "}
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>
                                    {post.images?.length > 1 ? (
                                        <Carousel images={post.images} />
                                    ) : post.images?.length === 1 ? (
                                        <img
                                            src={post.images[0]}
                                            alt="Post"
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderTopLeftRadius: "8px",
                                                borderTopRightRadius: "8px",
                                            }}
                                        />
                                    ) : null}
                                    {editPostId === post.id ? (
                                        <div style={{ marginTop: "5px" }}>
                                            <textarea
                                                value={editPostText}
                                                onChange={(e) => setEditPostText(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.3rem",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "3px",
                                                    fontSize: "0.9rem",
                                                    resize: "vertical",
                                                    minHeight: "80px",
                                                }}
                                            />
                                            <div style={{ marginTop: "5px" }}>
                                                <button
                                                    onClick={() => handleSaveEditPost(post.id)}
                                                    style={{
                                                        background: "#4CAF50",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.3rem 0.8rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditPostId(null)}
                                                    style={{
                                                        background: "#f44336",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.3rem 0.8rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        marginLeft: "5px",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.3", margin: "5px 0" }}>
                                            {post.text || "No text"}
                                        </p>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            marginTop: "5px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{
                                                border: "none",
                                                background: "linear-gradient(to right, #FF69B4, #FFA500)",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                padding: "0.3rem 0.8rem",
                                                borderRadius: "4px",
                                                transition: "background 0.3s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #FF1493, #FF8C00)")}
                                            onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #FF69B4, #FFA500)")}
                                        >
                                            {hasLiked ? "❤️ Liked" : "👍 Like"}
                                        </button>
                                    </div>
                                    {likeCount > 0 && (
                                        <p
                                            style={{
                                                marginTop: "5px",
                                                color: "#666",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {hasLiked
                                                ? likeCount === 1
                                                    ? "You liked this"
                                                    : `You and ${likeCount - 1} others`
                                                : `${likeCount} ${likeCount === 1 ? "person" : "people"} liked this`}
                                            {likeList.length > 0 && (
                                                <span style={{ marginLeft: "0.3rem" }}>
                                                    (Liked by: {likeList.join(", ")})
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <div style={{ marginTop: "5px" }}>
                                        <h4 style={{ fontSize: "1rem", color: "#333", marginBottom: "5px" }}>Comments</h4>
                                        {post.comments && post.comments.length > 0 ? (
                                            <>
                                                {post.comments.slice(0, 2).map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        style={{
                                                            backgroundColor: "#f9f9f9",
                                                            padding: "0.5rem",
                                                            marginBottom: "5px",
                                                            borderRadius: "4px",
                                                            borderLeft: "2px solid #1976d2",
                                                            position: "relative",
                                                        }}
                                                    >
                                                        {editCommentId === comment.id ? (
                                                            <div style={{ display: "flex", gap: "0.3rem" }}>
                                                                <input
                                                                    type="text"
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    style={{
                                                                        flex: "1",
                                                                        padding: "0.2rem",
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "3px",
                                                                        fontSize: "0.8rem",
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => handleSaveEditComment(post.id, comment.id)}
                                                                    style={{
                                                                        background: "#4CAF50",
                                                                        color: "white",
                                                                        border: "none",
                                                                        padding: "0.2rem 0.4rem",
                                                                        borderRadius: "3px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <strong style={{ color: "#1976d2" }}>{comment.user}</strong>
                                                                <span style={{ color: "#555", marginLeft: "0.2rem" }}>:</span>{" "}
                                                                {comment.text}
                                                                <br />
                                                                <small style={{ color: "#888", fontSize: "0.7rem" }}>
                                                                    {new Date(comment.createdAt).toLocaleString()}
                                                                </small>
                                                            </>
                                                        )}
                                                        {comment.user?.toLowerCase() === currentUsername && (
                                                            <div style={{ marginTop: "0.3rem" }}>
                                                                {editCommentId !== comment.id && (
                                                                    <button
                                                                        onClick={() => handleEditComment(comment, post.id)}
                                                                        style={{
                                                                            background: "#2196F3",
                                                                            color: "white",
                                                                            border: "none",
                                                                            padding: "0.2rem 0.4rem",
                                                                            borderRadius: "3px",
                                                                            cursor: "pointer",
                                                                            marginRight: "0.3rem",
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                    style={{
                                                                        background: "#f44336",
                                                                        color: "white",
                                                                        border: "none",
                                                                        padding: "0.2rem 0.4rem",
                                                                        borderRadius: "3px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {post.comments.length > 2 && (
                                                    <button
                                                        onClick={() => handleViewAllComments(post)}
                                                        style={{
                                                            background: "#2196F3",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "0.3rem 0.8rem",
                                                            borderRadius: "4px",
                                                            cursor: "pointer",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        View All Comments ({post.comments.length})
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p style={{ color: "#888", fontStyle: "italic", fontSize: "0.8rem", margin: "5px 0" }}>
                                                No comments yet.
                                            </p>
                                        )}
                                        <div style={{ marginTop: "5px", display: "flex", gap: "0.5rem" }}>
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    flex: "1",
                                                    padding: "0.3rem",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "3px",
                                                    fontSize: "0.8rem",
                                                }}
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post.id)}
                                                style={{
                                                    background: "linear-gradient(to right, #FF0000, #FFFF00)",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.3rem 0.8rem",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "0.8rem",
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
                                {isOwner && !editPostId && (
                                    <div style={{ position: "absolute", top: "5px", right: "5px" }}>
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            style={{
                                                background: "#2196F3",
                                                color: "white",
                                                border: "none",
                                                padding: "0.3rem 0.8rem",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                marginRight: "5px",
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            style={{
                                                background: "#f44336",
                                                color: "white",
                                                border: "none",
                                                padding: "0.3rem 0.8rem",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pop-up for All Comments */}
            {showAllComments && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1000",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            width: "90%",
                            maxWidth: "500px",
                        }}
                    >
                        <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>
                            All Comments for "{showAllComments.text || "Post"}"
                        </h3>
                        {showAllComments.comments.map((comment) => (
                            <div
                                key={comment.id}
                                style={{
                                    backgroundColor: "#f9f9f9",
                                    padding: "0.5rem",
                                    marginBottom: "5px",
                                    borderRadius: "4px",
                                    borderLeft: "2px solid #1976d2",
                                    position: "relative",
                                }}
                            >
                                {editCommentId === comment.id ? (
                                    <div style={{ display: "flex", gap: "0.3rem" }}>
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            style={{
                                                flex: "1",
                                                padding: "0.2rem",
                                                border: "1px solid #ddd",
                                                borderRadius: "3px",
                                                fontSize: "0.8rem",
                                            }}
                                        />
                                        <button
                                            onClick={() => handleSaveEditComment(showAllComments.id, comment.id)}
                                            style={{
                                                background: "#4CAF50",
                                                color: "white",
                                                border: "none",
                                                padding: "0.2rem 0.4rem",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <strong style={{ color: "#1976d2" }}>{comment.user}</strong>
                                        <span style={{ color: "#555", marginLeft: "0.2rem" }}>:</span>{" "}
                                        {comment.text}
                                        <br />
                                        <small style={{ color: "#888", fontSize: "0.7rem" }}>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </small>
                                    </>
                                )}
                                {comment.user?.toLowerCase() === currentUsername && (
                                    <div style={{ marginTop: "0.3rem" }}>
                                        {editCommentId !== comment.id && (
                                            <button
                                                onClick={() => handleEditComment(comment, showAllComments.id)}
                                                style={{
                                                    background: "#2196F3",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.2rem 0.4rem",
                                                    borderRadius: "3px",
                                                    cursor: "pointer",
                                                    marginRight: "0.3rem",
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteComment(showAllComments.id, comment.id)}
                                            style={{
                                                background: "#f44336",
                                                color: "white",
                                                border: "none",
                                                padding: "0.2rem 0.4rem",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={closePopup}
                            style={{
                                background: "#f44336",
                                color: "white",
                                border: "none",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;