import React, { useEffect, useState } from "react";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../firebase";

import Navbar from "../../components/Navbar";
import Dashboard from "../../components/Dashboard";
import Panel from "../../components/Panel";
import UserContext from "../../context/UserContext";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard | Finarrator';
  }, []);

  useEffect(() => {
    const initUser = async () => {
      try {
        // Step 1: Fetch user info from your backend (checks cookie auth)
        const res = await axios.get("/api/getUser", { withCredentials: true });
        const user = res.data;
        setUserInfo(user);
        console.log("✅ App: user info fetched", user);

        // Step 2: Get Firebase custom token from backend
        const tokenRes = await axios.get("/api/firebaseCustomToken", {
          withCredentials: true,
        });

        // Step 3: Sign in to Firebase client-side using the custom token
        const { token } = tokenRes.data;
        await signInWithCustomToken(auth, token);
        console.log("✅ Signed in to Firebase client-side with custom token");
      } catch (err) {
        console.error("❌ App: error in auth flow", err);
      }
    };

    initUser();
  }, []);

  return (
    <UserContext.Provider value={userInfo}>
      <div className="flex flex-col justify-center">
        <Navbar />
        <Panel />
      </div>
    </UserContext.Provider>
  );
};

export default Home;
