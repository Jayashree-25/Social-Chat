import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import CreatePost from "./pages/CreatePost";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<MainLayout />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/create" element={<CreatePost />} />
    </Routes>
  );
};

export default App;