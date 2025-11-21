import React, { useState, useEffect, useRef, useContext } from 'react';
import UserContext from '../context/UserContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const userInfo = useContext(UserContext);

  const tabs = ['dashboard', 'RAG', 'futuremirror'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    window.location.href = 'http://localhost:5173/register';
  };

  const handleDisconnectMCP = async () => {
    try {
      await fetch(import.meta.env.VITE_API_BASE_URL + '/logout', {
        method: 'GET',
        credentials: 'include',
      });
      window.location.href = 'http://localhost:5173/login';
    } catch (error) {
      console.error('Error disconnecting MCP:', error);
    }
  };

  return (
    <>
      <div className='flex w-full h-16 fixed top-0 left-0 bg-[#f8fafb] justify-between px-4 sm:px-6 shadow-lg z-50 border-b border-gray-200'>

        <div className='flex items-center'>
          <img
            src="https://imgs.search.brave.com/rL3DaQCbdE4rBfy3jVQQQZagNrCD_8zFSnWIQibcbQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC83/Ni83MC9vdmVybGFw/cGluZy1wYXBlci1m/LWxvZ28tdmVjdG9y/LTI3Mjk3NjcwLmpw/Zw"
            alt="Logo"
            className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mr-3'
          />
          <h1 className='font-bold text-xl md:text-2xl text-gray-800'>Finarrator</h1>
        </div>

        <div className='hidden sm:flex items-center gap-x-2'>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${activeTab === tab
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                }`}
            >
              {tab === 'dashboard' ? (
                <>
                  <i className="ri-dashboard-3-line mr-2"></i> Dashboard
                </>
              ) : tab === 'RAG' ? (
                <>
                  <i className="ri-file-upload-line mr-2"></i> Documents
                </>
              ) : tab === 'futuremirror' ? (
                <>
                  <i className="ri-eye-line mr-2"></i> Future Mirror
                </>
              ) : tab}
            </button>
          ))}
        </div>

        <div className='hidden sm:flex items-center gap-3 relative' ref={dropdownRef}>
          {/* User welcome message */}
          {userInfo && (
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm text-gray-600">Welcome</span>
              <span className="text-md font-semibold text-gray-800 truncate max-w-[120px]">
                {userInfo.name}
              </span>
            </div>
          )}

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEczAkkJk3_grRyMNSAIBfcUoKFWGoVPz7Kg&s"
            alt="User"
            className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm'
          />
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`text-2xl rounded-full flex items-center transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
              }`}
          >
            <i className="ri-arrow-down-s-line text-2xl text-gray-600"></i>
          </button>

          {dropdownOpen && (
            <div className='absolute top-14 right-0 w-48 bg-white shadow-lg rounded-lg flex flex-col items-start p-2 gap-1 z-50 border border-gray-100'>
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className='w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100'
              >
                <i className="ri-settings-line mr-2" /> Disconnect MCP
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className='w-full text-left px-4 py-2 text-sm text-red-600 flex items-center hover:bg-red-50'
              >
                <i className="ri-logout-circle-r-line mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button (if needed) */}
        <div className='sm:hidden flex items-center'>
          <button className="p-2">
            <i className="ri-menu-line text-2xl text-gray-700"></i>
          </button>
        </div>
      </div>


      {/* Modals */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 bg-red-600 text-white rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Disconnect MCP</h2>
            <p className="text-sm text-gray-600 mb-6">Disconnect and return to login?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDisconnectConfirm(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleDisconnectMCP} className="px-4 py-2 bg-yellow-600 text-white rounded">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;