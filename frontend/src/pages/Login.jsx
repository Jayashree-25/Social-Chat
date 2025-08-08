import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    auroraStyle,
    containerStyle,
    formBoxStyle,
    inputStyle,
    buttonStyle,
    linkStyle
} from "../styles/AuthStyles";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = auroraStyle;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token); // Save token
            console.log("Login successful:", res.data);

            navigate("/home");
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('http://localhost:5000/api/auth/google', { credential });
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            console.error("Google login failed:", err.response?.data || err.message);
            alert("Google Login Failed");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formBoxStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 600 }}>
                    Sign in to your Account
                </h2>

                <form onSubmit={handleLogin}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div>
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" style={{ marginLeft: "8px" }}>Remember me</label>
                        </div>
                        <a href="#" style={{ ...linkStyle, fontSize: "14px" }}>Forgot password?</a>
                    </div>

                    <button type="submit" style={buttonStyle}>
                        Sign in
                    </button>
                </form>

                <div style={{ textAlign: "center", margin: "20px 0", color: "rgba(255,255,255,0.5)" }}>or</div>

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => alert("Google login failed")}
                    theme="outline"
                    size="large"
                    width="100%"
                />

                <p style={{ textAlign: "center", marginTop: "20px", color: 'rgba(255,255,255,0.7)' }}>
                    Don’t have an account yet? <Link to="/signup" style={linkStyle}>Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;