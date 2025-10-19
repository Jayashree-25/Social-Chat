import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };
  
  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};