import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(response.data.user);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("token");
        }
      }
    };
    fetchUser(); // Fixed from fetchPost()
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};