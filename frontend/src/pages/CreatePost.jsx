import React, { useState, useContext } from "react";
import { FeedContext } from "../components/FeedContext";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

    const [images, setImages] = useState([]);
    const [text, setText] = useState([]);
    const { addPost } = useContext(FeedContext);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(newImages);
    }

    const handlePost = () => {
        if (text.trim === "" && images.length === 0) return;

        const newPost = {
            text,
            images,
            timestamp: new Date().toISOString(),
        };
        addPost(newPost);
        navigate("/home");
    }

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
                <div style={{ display: "flex", gap: "2rem", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {/* Left: Image Upload */}
                    <label htmlFor="imageUpload" style={{
                        cursor: "pointer",
                        padding: "10px 20px",
                        border: "2px dashed #000",
                        borderRadius: "10px",
                        color: "#000",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        Click to Add Images
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    <div style={{
                        display: "flex",
                        overflowX: "auto",
                        gap: "10px",
                        // padding: "5px",
                        width: "100%",
                        maxHeight: "300px"
                    }}>
                        {images.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`uploaded-${index}`}
                                style={{ height: "150px", borderRadius: "10px" }}
                            />
                        ))}
                    </div>

                    {/* Down: Inputs */}
                    <div
                        style={{
                            flex: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "10px",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "40%"
                        }}
                    >

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Write your post..."
                            style={{
                                height: "80%",
                                borderRadius: "10px",
                                padding: "15px",
                                resize: "none",
                                border: "none",
                                fontSize: "16px",
                                backgroundColor: "rgba(231, 214, 233, 0.72)",
                                color: "#000",
                                outline: "none"
                            }}
                        />

                        <button
                            onClick={handlePost}
                            style={{
                                padding: "10px 25px",
                                backgroundColor: "#ffffff55",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: "bold",
                                color: "#000",
                                cursor: "pointer",
                                alignSelf: "flex-end",
                                marginTop: "10px"
                            }}>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
