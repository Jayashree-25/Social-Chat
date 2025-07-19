import React from "react";

const CreatePost = () => {
    return (
        <div
            style={{
                height: "88.7vh",
                background: "linear-gradient(to right, #dbeafe, #9f83b3ff)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    backdropFilter: "blur(15px)",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    padding: "2rem",
                    width: "95%",
                    maxWidth: "1300px",
                    height: "600px", 
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                {/* Top Content Area */}
                <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
                    {/* Left: Image Upload */}
                    <div
                        style={{
                            flex: 1,
                            background: "rgba(255, 255, 255, 0.3)",
                            border: "2px dashed rgba(255, 255, 255, 0.6)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1e3a8a",
                            fontWeight: "bold",
                            cursor: "pointer",
                            minHeight: "100%",
                        }}
                    >
                        + Add Image
                    </div>

                    {/* Right: Inputs */}
                    <div
                        style={{
                            flex: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Post Title"
                            style={{
                                padding: "0.8rem",
                                borderRadius: "8px",
                                border: "1px solid rgba(0,0,0,0.1)",
                                outline: "none",
                                fontSize: "1rem",
                                marginBottom: "1rem",
                            }}
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            style={{
                                flexGrow: 1,
                                padding: "0.8rem",
                                borderRadius: "8px",
                                border: "1px solid rgba(0,0,0,0.1)",
                                outline: "none",
                                resize: "none",
                                fontSize: "1rem",
                            }}
                        />
                    </div>
                </div>

                {/* Bottom: Post Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                    <button
                        style={{
                            padding: "0.8rem 1.5rem",
                            borderRadius: "8px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
