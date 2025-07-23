import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserWrapper from "./components/UserWrapper.jsx";
import { FeedProvider } from "./components/FeedContext";

const clientId = "232617022214-ul4up1faq5l5ev7dbbj05mrddd76uk2b.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <UserWrapper>
        <FeedProvider>
          <App />
        </FeedProvider>
      </UserWrapper>
    </BrowserRouter>
  </GoogleOAuthProvider>
);