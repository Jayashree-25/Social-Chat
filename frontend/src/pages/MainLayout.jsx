import React, { useContext } from "react";
import { UserContext } from "../components/UserWrapper";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const MainLayout = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            {/* Middle Feed */}
            <div style={{ flex: 1, padding: "20px", overflow: "auto", height: "100vh", position: "relative" }}>
                {/* Sample long feed */}
                <div>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <p key={i}>Post #{i + 1} — [Like / Comment Coming Soon]</p>
                    ))}
                </div>
            </div>

            {/* Right Chat Area */}
            <div style={{ width: "20%", background: "#f9f9f9", padding: "20px", height: "100vh", overflow: "auto", borderLeft: "1px solid #ddd" }}>
                <p>Chat goes here...</p>
            </div>
        </div>
    );
};

export default MainLayout;
