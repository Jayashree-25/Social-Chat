import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });
        // You can send to backend here
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
                onSuccess={(credentialResponse) => {
                    console.log("Google Login Success:", credentialResponse);
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