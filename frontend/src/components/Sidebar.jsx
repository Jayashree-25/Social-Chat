import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div style={{
            width: "250px",
            height: "100vh",
            background: "#f2f2f2",
            paddingTop: "20px"
        }}>
            <List>
                <ListItem button>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Notification" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon sx={{ color: "red" }} /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: "red" }} />
                </ListItem>
            </List>
        </div>
    )
}
export default Sidebar;