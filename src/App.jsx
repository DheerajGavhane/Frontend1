// src/App.jsx

import React from "react";
// Ensure you are importing BrowserRouter, not HashRouter.
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
// ... components imports
import FinarratorLandingPage from "./pages/Register";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Home from "./pages/Home";
import McpLoginPage from "./pages/McpLoginPage";
function App() {
  return (
    // 'Router' here is an alias for BrowserRouter.
    <Router> 
      <Routes>
        
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<FinarratorLandingPage />} />
        <Route path="/signup" element={<SignupPage error={null} />} />
        <Route path="/login" element={<LoginPage error={null} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/Fi-MCP/login" element={<McpLoginPage />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;