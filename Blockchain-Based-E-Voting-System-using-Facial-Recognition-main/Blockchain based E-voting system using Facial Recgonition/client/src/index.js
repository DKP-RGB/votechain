import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// StrictMode removed to prevent double-mounting of camera/face-api components
root.render(<App />);
