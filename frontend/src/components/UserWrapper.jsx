import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err.response?.data || err.message);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserWrapper;
