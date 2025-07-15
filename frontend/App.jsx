import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const App = () => {
  return (
    <div>
      <h1>Login with Google</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Login Success:", credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default App;
