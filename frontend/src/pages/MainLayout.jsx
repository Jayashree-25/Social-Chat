import React, { useContext } from "react";
import { UserContext } from "../components/UserWrapper";

const MainLayout = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Left Sidebar */}
            <div style={{ width: "20%", background: "#f2f2f2", padding: "20px" }}>
                <p><strong>Home</strong></p>
                <p>Notifications</p>
                <p>Profile</p>
                <p onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }} style={{ cursor: "pointer", color: "red" }}>
                    Logout
                </p>
            </div>

            {/* Middle Feed */}
            
            <div style={{ width: "60%", padding: "20px" }}>
                <h2>Welcome, {currentUser?.name || "User"}!</h2>
                <div>
                    <p>[Post 1]</p>
                    <p>[Post 2]</p>
                    <p>[Like, Comment Features... coming soon]</p>
                </div>
            </div>

            {/* Right Chat Area */}
            <div style={{ width: "20%", background: "#f9f9f9", padding: "20px" }}>
                <p>Chat goes here...</p>
            </div>
        </div>
    );
}

export default MainLayout;