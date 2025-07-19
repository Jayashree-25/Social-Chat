import React, { useContext } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import FeedContext from "../components/FeedContext";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const MainLayout = () => {
    const { currentUser } = useContext(UserContext);
    const { posts } = useContext(FeedContext);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            {/* Middle Feed */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", height: "100vh", position: "relative" }}>
                {posts.length === 0 ? (
                    <p>No posts yet...</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "1rem",
                                marginBottom: "1rem",
                                borderRadius: "10px",
                                background: "#fff"
                            }}
                        >
                            <p>{post.text}</p>
                            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
                                {post.images?.map((imgSrc, i) => (
                                    <img
                                        key={i}
                                        src={imgSrc}
                                        alt={`uploaded-${i}`}
                                        style={{ height: "100px", borderRadius: "10px" }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Right Chat Area */}
            <div style={{ width: "20%", background: "#f9f9f9", padding: "20px", height: "100vh", overflow: "auto", borderLeft: "1px solid #ddd" }}>
                <p>Chat goes here...</p>
            </div>
        </div>
    );
};

export default MainLayout;
