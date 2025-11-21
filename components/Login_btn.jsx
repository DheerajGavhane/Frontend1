import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

const Login_btn = () => {
    const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
       <div className=''>
    {!isAuthenticated ? (
      <button
        className='bg-blue-500 px-4 py-2 rounded-lg text-white'
        onClick={() => loginWithRedirect()}
      >
        Log In
      </button>
    ) : (
      <>
        <h1 className="text-xl font-bold">Welcome, {user.name}</h1>
        <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full" />
        <button
          className='bg-red-500 px-4 py-2 rounded-lg text-white'
          onClick={() => logout({ returnTo: "http://localhost:5173" })}
        >
          Log Out
        </button>
      </>
    )}
  </div>
  )
}

export default Login_btn