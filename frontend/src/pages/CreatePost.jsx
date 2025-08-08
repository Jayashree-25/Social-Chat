import React, { useState, useContext, useEffect, useRef } from "react";
import { FeedContext } from "../components/FeedContext";
import { useNavigate } from "react-router-dom";
import { auroraStyle } from "../styles/AuthStyles";
import Picker from "emoji-picker-react";

const CreatePost = () => {

    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const { addPost } = useContext(FeedContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImageUrls]);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handlePost = () => {
        if (text.trim() === "" && images.length === 0) return;

        const newPost = {
            text,
            images,
            timestamp: new Date().toISOString(),
        };
        addPost(newPost);
        navigate("/home");
    };

    const onEmojiClick = (emojiObject) => {
        setText(prevText => prevText + emojiObject.emoji);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
        setHoveredImageIndex(null);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '97vh', }}>
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
                        ref={fileInputRef}
                    />
                    <div style={{ display: "flex", overflowX: "auto", gap: "10px", minHeight: '100px' }}>
                        {images.map((imgSrc, index) => (
                            <div
                                key={index}
                                style={{ position: 'relative', flexShrink: 0 }}
                                onMouseEnter={() => setHoveredImageIndex(index)}
                                onMouseLeave={() => setHoveredImageIndex(null)}
                            >
                                <img
                                    src={imgSrc}
                                    alt={`uploaded-${index}`}
                                    style={{ height: "100px", width: '100px', objectFit: 'cover', borderRadius: "10px" }}
                                />
                                {hoveredImageIndex === index && (
                                    <div
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0, 0, 0, 0.6)',
                                            backdropFilter: 'blur(4px)',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.3s ease',
                                            opacity: 1
                                        }}
                                    >
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Text and Post Button */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: 'relative' }}>
                    <div style={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column', }}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind?"
                            style={{
                                flexGrow: 1,
                                borderRadius: "10px",
                                padding: "15px 45px 15px 15px",
                                resize: "none",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                background: "rgba(0, 0, 0, 0.2)",
                                fontSize: "16px",
                                color: "#fff",
                                outline: "none",
                            }}
                        />

                        <button
                            onClick={() => setShowEmojis(!showEmojis)}
                            style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '24px',
                                padding: 0,
                                opacity: 0.7,
                                color: "#c48df5ff",
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
                        <button
                            onClick={handlePost}
                            style={{
                                padding: "10px 25px",
                                background: "linear-gradient(to right, #8e2de2, #4a00e0)",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: "bold",
                                color: "#fff",
                                cursor: "pointer",
                                transition: 'opacity 0.2s ease',
                                marginTop: "10px"
                            }}
                            onMouseOver={(e) => e.target.style.opacity = 0.9}
                            onMouseOut={(e) => e.target.style.opacity = 1}
                        >
                            Post
                        </button>
                    </div>

                    {showEmojis && (
                        <div style={{ position: 'absolute', bottom: '80px', right: 0, zIndex: 10 }}> {/* Changed: Positioned relative to the right column */}
                            <Picker
                                onEmojiClick={onEmojiClick}
                                theme="dark"
                                pickerStyle={{
                                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
