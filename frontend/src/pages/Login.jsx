import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token); // Save token
            console.log("Login successful:", res.data);

            navigate("/home"); // redirect to main feed
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");
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
            <h2 style={{
                textAlign: "center",
                marginBottom: "20px"
            }}>
                Sign in to your Account
            </h2>

            <form onSubmit={handleLogin}>
                <label> Email </label>
                <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="password"
                    placeholder="*** ***"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                    }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember" style={{ marginLeft: "5px" }}>Remember me</label>
                    </div>
                    <a href="#" style={{ fontSize: "14px" }}>Forgot password?</a>
                </div>

                <button type="submit" style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}>
                    Sign in
                </button>
            </form>

            <div style={{ textAlign: "center", margin: "15px 0", color: "#aaa" }}>or</div>

            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        const res = await axios.post("http://localhost:3000/api/auth/google", {
                            credential: credentialResponse.credential
                        });

                        localStorage.setItem("token", res.data.token);
                        navigate("/home");
                    } catch (err) {
                        console.error("Google login failed:", err.response?.data || err.message);
                        alert("Google Login Failed");
                    }
                }}
                onError={() => {
                    console.log("Google Login Failed");
                }}
            />

            <p style={{ textAlign: "center", marginTop: "20px" }}>
                Don’t have an account yet? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    )
}

export default Login;