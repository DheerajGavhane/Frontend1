// ✅ FRONTEND: Home.jsx (Final Updated with Enlarging Functionality)
import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Dashboard from './Dashboard';
import { X } from 'lucide-react'; // or use any other icon library

const Panel = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [isChatbotMaximized, setIsChatbotMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsChatbotMaximized(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden relative bg-[#1123313c]">

      {/* Chatbot Section for Large Screens */}
      <div 
        className={`hidden lg:block fixed left-10 top-20 p-5 z-10 rounded-2xl transition-all duration-300 ease-in-out
          ${isChatbotMaximized ? 'w-[calc(100%-4rem)] h-[calc(100%-4rem)]' : 'w-[30%] h-[90vh]'}`
        }
      >
        <Chatbot isMaximized={isChatbotMaximized} toggleMaximize={toggleMaximize} />
      </div>

      {/* Dashboard Section (push to right on large screens) */}
      <div className="w-full lg:ml-[35.33%] lg:w-[66.66%] h-screen overflow-y-auto p-5 mt-20 mb-30">
        <Dashboard />
      </div>

      {/* Chatbot Toggle Button for Small Screens */} 
      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="lg:hidden fixed bottom-5 right-5 p-4 px-5 bg-[#2A3235] text-white rounded-full shadow-md z-50"
        >
          <i className="ri-robot-3-fill"></i>
        </button>
      )}

      {/* Fullscreen Chatbot Modal on Small Screens */}
      {chatbotOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setChatbotOpen(false)}
              className="text-black text-xl"
            >
              <X />
            </button>
          </div>
          {/* Chatbot */}
          <div className="flex-grow p-5">
            {/* The small-screen chatbot will always be maximized */}
            <Chatbot isMaximized={true} toggleMaximize={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;