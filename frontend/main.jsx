import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "http://232617022214-ul4up1faq5l5ev7dbbj05mrddd76uk2b.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById(" root ")).render(
    <GoogleOAuthProvider clientId= {clientId} >
        <App />
    </GoogleOAuthProvider>
)