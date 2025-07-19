import React from 'react';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import { Routes, Route } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CreatePost from './pages/CreatePost';
import { FeedProvider } from './components/FeedContext';

const App = () => {
  return (
    <FeedProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<MainLayout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </FeedProvider>
  );
};

export default App;
