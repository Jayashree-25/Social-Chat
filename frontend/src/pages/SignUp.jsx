import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
    const [formData, setFormDate] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormDate((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Password do not match!");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            console.log("Signup successful: ", res.data);
            alert("Signup Successful!");
            // Optionally: save token in localStorage, redirect user
            localStorage.setItem("token", res.data.token);
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div style={{
            maxWidth: "400px",
            margin: "80px auto",
            padding: "30px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Create an Account
            </h2>

            <form onSubmit={handleSignup}>
                <label> Name </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label> Email </label>
                <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label> Password </label>
                <input
                    type="password"
                    name="password"
                    placeholder="*** ***"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label> Confirm Password </label>
                <input
                    type="password"
                    name="Confirmpassword"
                    placeholder="*** ***"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>Sign Up</button>
            </form>

            <div style={{
                textAlign: "center",
                margin: "15px 0",
                color: "#aaa"
            }}>
                or
            </div>

            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log("Google Sign Up Success:", credentialResponse);
                }}
                onError={() => {
                    console.log("Google Sign Up Failed");
                }}
            />
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
                Already have an account? <Link href="/">Log in</Link>
            </p>
        </div >
    )
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer"
};

export default Signup;