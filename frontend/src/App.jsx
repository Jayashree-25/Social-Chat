import React from 'react';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import { Routes, Route } from "react-router-dom";
import MainLayout from './pages/MainLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<MainLayout />} />
    </Routes>
  );
};

export default App;
