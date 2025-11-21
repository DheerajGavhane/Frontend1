import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";
import UserContext from "../context/UserContext";

const MCPLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/Fi-MCP/login", { mobile, password }, { withCredentials: true });

      if (res.data.success) {
        // Fetch updated user info
        const userRes = await axios.get("/api/getUser", { withCredentials: true });
        setUserInfo(userRes.data);

        // Firebase custom token login
        const tokenRes = await axios.get("/api/firebaseCustomToken", { withCredentials: true });
        await signInWithCustomToken(auth, tokenRes.data.token);

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ MCP Login Error:", err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64 mx-auto mt-20">
      <input type="text" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} required className="border p-2"/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2"/>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default MCPLogin;
