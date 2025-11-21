
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";

const ProfileDetails = () => {
  const userInfo = useContext(UserContext);
  const [loadedTime, setLoadedTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLoadedTime(formatted);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2 text-indigo-600">👤</span>
          Profile Details
        </h2>
        <div className="text-sm text-gray-500">Loaded at: {loadedTime}</div>
      </div>

      {userInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="text-sm text-gray-500">Username</h4>
            <p className="text-lg font-medium text-indigo-800">
              {userInfo.name || "N/A"}
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="text-sm text-gray-500">Email</h4>
            <p className="text-lg font-medium text-indigo-800">
              {userInfo.email || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-red-600 font-medium">User not logged in.</div>
      )}
    </div>
  );
};

export default ProfileDetails;
