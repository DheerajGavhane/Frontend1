// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
// Removed unused imports: BrowserRouter, Routes, Route, Navigate
import App from "./App";
import FinarratorLandingPage from "./pages/Register";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage";
import "./index.css";

// NOTE: Since the <Router> is now in App.jsx, the routes for
// /register, /signup, and /login should also be moved there
// or handled as part of the initial login flow.
// For now, we'll render App directly.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Renders the App component, which now contains the single BrowserRouter. */}
    <App />
  </React.StrictMode>
);