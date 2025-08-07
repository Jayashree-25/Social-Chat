import React, { useContext, useEffect, useState, useRef } from "react"; // Added useRef to imports
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import { FeedContext } from "../components/FeedContext";
import Carousel from "../components/Carousel";

const auroraStyle = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@keyframes moveGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
body {
    background: linear-gradient(-45deg, #0b021a, #2c0b4d, #1a0a3a, #000000);
    background-size: 400% 400%;
    animation: moveGradient 15s ease infinite;
    font-family: 'Inter', sans-serif;
    color: #333;
}
`;

const MainLayout = () => {
    const { currentUser, loading, error } = useContext(UserContext) || {};
    const feedContext = useContext(FeedContext) || {};
    const {
        posts = [],
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
        // Inject the aurora styles into the document's head
        const styleTag = document.createElement("style");
        styleTag.innerHTML = auroraStyle;
        document.head.appendChild(styleTag);

        // Cleanup function to remove the style when the component unmounts
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

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
        setEditCommentId(comment._id);
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
                    padding: "20px",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    maxWidth: "1000px",
                    marginRight: "350px",
                    borderRadius: "16px"
                }}
            >
                {posts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginTop: '60px' }}>
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        <h2 style={{ marginTop: '20px', fontWeight: 600, color: '#fff' }}>Your Feed is Empty</h2>
                        <p>Start by creating a new post to share your thoughts.</p>
                    </div>
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
                                    maxWidth: "900px",
                                    margin: "0 auto 24px auto",
                                    background: "rgba(255, 255, 255, 0.08)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                                    overflow: "hidden",
                                    position: "relative",
                                    color: "#fff",
                                }}
                            >
                                <div style={{ padding: "24px" }}>
                                    <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)", marginBottom: "12px", fontWeight: 500 }}>
                                        Posted by: <strong style={{ color: '#ffffff', fontWeight: 600 }}>{post.username}</strong> |{" "}
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>

                                    {post.images?.length > 0 && (
                                        // Changed: This container now enforces a fixed height for the image/carousel
                                        <div style={{ height: '400px', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                            {post.images.length > 1 ? (
                                                <Carousel images={post.images} />
                                            ) : (
                                                <img
                                                    src={post.images[0]}
                                                    alt="Post"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}

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
                                        <p style={{ color: "#e5e7eb", lineHeight: "1.6" }}>
                                            {post.text || ""}
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
                                                background: hasLiked ? '#ede9fe' : '#f3f4f6',
                                                color: hasLiked ? '#8b5cf6' : '#4b5563',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '9999px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                transition: 'all 0.2s ease',
                                            }}
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


                                    <div style={{ marginTop: "20px" }}>
                                        <h4 style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", marginBottom: "12px" }}>Comments</h4>
                                        {post.comments && post.comments.length > 0 ? (
                                            <>
                                                {post.comments && post.comments.length > 0 && (
                                                    <button
                                                        onClick={() => handleViewAllComments(post)}
                                                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 500 }}
                                                    >
                                                        View all {post.comments.length} comments
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p style={{ color: "#888", fontStyle: "italic", fontSize: "0.8rem", margin: "5px 0" }}>
                                                No comments yet.
                                            </p>
                                        )}

                                        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    flex: "1",
                                                    padding: "0.3rem",
                                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                                    background: "rgba(0, 0, 0, 0.2)",
                                                    color: '#fff',
                                                    borderRadius: "8px",
                                                    fontSize: "0.9rem",
                                                    outline: 'none',
                                                }}
                                            />
                                            <button
                                                onClick={() => handleCommentSubmit(post.id)}
                                                style={{
                                                    background: "linear-gradient(to right, #8e2de2, #e000e0ff)",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "0.3rem 0.8rem",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontSize: "0.8rem",
                                                    transition: "background 0.3s",
                                                }}
                                                onMouseOver={(e) => e.target.style.opacity = 0.9}
                                                onMouseOut={(e) => e.target.style.opacity = 1}
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {isOwner && !editPostId && (
                                    <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#f87171',
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
                <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.6)", backdropFilter: 'blur(5px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000" }}>
                    <div style={{ background: "rgba(25, 25, 25, 0.8)", border: '1px solid rgba(255,255,255,0.1)', padding: "24px", borderRadius: "16px", maxHeight: "80vh", overflowY: "auto", width: "90%", maxWidth: "600px", color: '#fff' }}>
                        <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "20px", borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                            Comments
                        </h3>
                        {showAllComments.comments.map((comment) => (
                            <div key={comment._id} style={{ marginBottom: "16px" }}>
                                <strong style={{ color: '#e5e7eb' }}>{comment.user}</strong>
                                {editCommentId === comment._id ? (
                                    <div>
                                        <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                                        <button onClick={() => handleSaveEditComment(showAllComments.id, comment._id)}>Save</button>
                                    </div>
                                ) : (
                                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0' }}>{comment.text}</p>
                                )}
                                <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{new Date(comment.createdAt).toLocaleString()}</small>
                                {currentUser.username.toLowerCase() === comment.user.toLowerCase() && (
                                    <div>
                                        <button onClick={() => handleEditComment(comment)}>Edit</button>
                                        <button onClick={() => handleDeleteComment(showAllComments.id, comment._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={closePopup}
                            style={{ background: "#f44336", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", marginTop: "20px", width: '100%' }}
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