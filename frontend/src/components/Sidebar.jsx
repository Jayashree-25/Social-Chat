import React, { useContext } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserContext } from "./UserWrapper";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <Box
            sx={{
                width: "20%",
                padding: "20px",
                borderRadius: "16px",
                margin: "20px",
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 40px)",
                background: "linear-gradient(135deg, rgba(0, 0, 50, 0.6), rgba(0, 0, 100, 0.2))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                color: "white",
            }}
        >
            {/* User Info */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        textAlign: "center",
                        fontFamily: "'Segoe UI', sans-serif",
                        fontSize: "1.2rem",
                    }}
                >
                    {currentUser?.username || "My Account"}
                </Typography>
                <Typography
                    sx={{
                        textAlign: "center",
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.7)",
                    }}
                >
                    My Account
                </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
                MENU
            </Typography>

            <List>
                <ListItem button onClick={() => navigate("/home")}>
                    <ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>

                <ListItem button onClick={() => navigate("/notifications")}>
                    <ListItemIcon sx={{ color: "white" }}><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Notifications" />
                </ListItem>
                <ListItem button onClick={() => navigate("/profile")}>
                    <ListItemIcon sx={{ color: "white" }}><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>

                <ListItem button onClick={handleLogout}>
                    <ListItemIcon sx={{ color: "white" }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: "white" }} />
                </ListItem>
            </List>
        </Box>
    );
}
export default Sidebar;