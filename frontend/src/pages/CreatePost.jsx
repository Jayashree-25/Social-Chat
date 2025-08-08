import React, { useState, useContext, useEffect } from "react";
import { FeedContext } from "../components/FeedContext";
import { useNavigate } from "react-router-dom";
import { auroraStyle } from "../styles/AuthStyles";

const CreatePost = () => {

    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const { addPost } = useContext(FeedContext);
    const navigate = useNavigate();

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = auroraStyle;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(newImages);
    }

    const handlePost = () => {
        if (text.trim() === "" && images.length === 0) return;

        const newPost = {
            text,
            images,
            timestamp: new Date().toISOString(),
        };
        addPost(newPost);
        navigate("/home");
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '97vh',  }}>
            <div style={{
                display: "flex",
                gap: "2rem",
                backdropFilter: "blur(15px)",
                background: "rgba(25, 25, 25, 0.6)",
                borderRadius: "20px",
                padding: "2rem",
                width: "95%",
                maxWidth: "1000px",
                minHeight: "600px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: '#fff'
            }}>
                {/* Left Column: Image Upload */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label htmlFor="imageUpload" style={{
                        cursor: "pointer",
                        padding: "20px",
                        border: "2px dashed rgba(255, 255, 255, 0.4)",
                        borderRadius: "10px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: "center",
                        flexGrow: 1,
                        transition: 'background-color 0.2s ease'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, marginBottom: '1rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <h3 style={{ margin: 0, fontWeight: 600 }}>Add Photos</h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)' }}>or drag and drop</p>
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                    <div style={{ display: "flex", overflowX: "auto", gap: "10px", minHeight: '100px' }}>
                        {images.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`uploaded-${index}`}
                                style={{ height: "100px", width: '100px', objectFit: 'cover', borderRadius: "10px" }}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Text and Post Button */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?"
                        style={{
                            flexGrow: 1,
                            borderRadius: "10px",
                            padding: "15px",
                            resize: "none",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            background: "rgba(0, 0, 0, 0.2)",
                            fontSize: "16px",
                            color: "#fff",
                            outline: "none",
                            marginBottom: '1rem'
                        }}
                    />
                    <button
                        onClick={handlePost}
                        style={{
                            padding: "12px 25px",
                            background: "linear-gradient(to right, #8e2de2, #4a00e0)",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            color: "#fff",
                            cursor: "pointer",
                            alignSelf: "flex-end",
                            transition: 'opacity 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = 0.9}
                        onMouseOut={(e) => e.target.style.opacity = 1}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
