import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export const UserContext = createContext();

const UserWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const user = { username: res.data.email, ...res.data };
        localStorage.setItem("token", tokenResponse.access_token);
        localStorage.setItem("username", user.username);
        setCurrentUser(user);
        console.log("Google OAuth success, user:", user);
      } catch (err) {
        setError("Google login failed");
        console.error("Google login error:", err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Login error");
      setLoading(false);
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("FetchUser token:", token);
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        console.log("API response user:", user);
        if (user?.username || user?.email) {
          const username = user.username || user.email;
          setCurrentUser({ ...user, username });
          localStorage.setItem("username", username);
        } else {
          setError("User data missing username or email");
        }
      } catch (err) {
        console.error("User fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  console.log("UserWrapper state:", { currentUser, loading, error });

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading, error, login }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserWrapper;