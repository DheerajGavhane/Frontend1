import React from "react";


const UserProfile = ({ user }) => (
  <div className="bg-red-100 w-72 h-40 flex flex-col  p-4 rounded-lg shadow-md">
    <h2 className="text-2xl">👤 User Profile</h2>
    <div className="text-xl">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  </div>
);

export default UserProfile;
