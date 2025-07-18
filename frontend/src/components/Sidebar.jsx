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
                backgroundColor: "#fdfdfd",
                padding: "20px",
                boxShadow: 3,
                borderRadius: "16px",
                margin: "20px",
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 40px)",
            }}
        >
            {/* Stylish App Title */}
            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    textAlign: "center",
                    fontFamily: "'Pacifico', cursive",
                    color: "#1976d2",
                    mb: 4,
                }}
            >
                Social Chat
            </Typography>

            <List>
                <ListItem button onClick={() => navigate("/")}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>

                <ListItem button onClick={() => navigate("/notifications")}>
                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Notifications" />
                </ListItem>

                <ListItem button onClick={() => navigate("/profile")}>
                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>

                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon sx={{ color: "red" }} /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: "red" }} />
                </ListItem>
            </List>
        </Box>
    );
}
export default Sidebar;