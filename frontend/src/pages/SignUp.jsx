import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    auroraStyle,
    containerStyle,
    formBoxStyle,
    inputStyle,
    buttonStyle,
    linkStyle
} from "../styles/AuthStyles"; 

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = auroraStyle;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem("token", res.data.token);
            navigate("/home"); // Redirect on successful signup
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('http://localhost:5000/api/auth/google', { credential });
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            console.error("Google signup failed:", err.response?.data || err.message);
            alert("Google Signup Failed");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formBoxStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 600 }}>
                    Create an Account
                </h2>

                <form onSubmit={handleSignup}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name</label>
                    <input type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required style={inputStyle} />

                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
                    <input type="email" name="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required style={inputStyle} />

                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
                    <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required style={inputStyle} />

                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Create Account</button>
                </form>

                <div style={{ textAlign: "center", margin: "20px 0", color: "rgba(255,255,255,0.5)" }}>or</div>

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => alert("Google signup failed")}
                    theme="outline"
                    size="large"
                    width="100%"
                />

                <p style={{ textAlign: "center", marginTop: "20px", color: 'rgba(255,255,255,0.7)' }}>
                    Already have an account? <Link to="/" style={linkStyle}>Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup;
