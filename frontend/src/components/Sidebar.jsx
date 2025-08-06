import React, { useContext } from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { UserContext } from "./UserWrapper";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/"; // Redirect to login/home page
    };

    const menuItems = [
        { text: "Home", icon: <HomeIcon />, path: "/home" },
        { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
        { text: "Create", icon: <AddCircleOutlineIcon />, path: "/create" },
        { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    ];
    const accentColor = '#9b59b6';

    return (
        <Box
            sx={{
                width: "250px",
                flexShrink: 0,
                padding: "20px",
                margin: "16px",
                height: "calc(100vh - 32px)",
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                color: "#ffffff",
            }}
        >
            {/* User Info */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                    {currentUser?.username || "My Account"}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)" }}>
                    Welcome Back
                </Typography>
            </Box>

            {/* Menu */}
            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7, paddingLeft: '16px' }}>
                MENU
            </Typography>

            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => {
                    // FIX: Define 'isActive' inside the map function
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? accentColor : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isActive ? accentColor : 'rgba(255, 255, 255, 0.1)',
                                    },
                                    transition: 'background-color 0.3s ease',
                                }}
                            >
                                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Button at the bottom */}
            <Box>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 82, 82, 0.2)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: "white" }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}
export default Sidebar;
