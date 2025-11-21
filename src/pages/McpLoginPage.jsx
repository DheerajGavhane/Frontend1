import React, { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
// 1. Custom CSS Styles (Injected via <style> tag)
// ----------------------------------------------------------------------
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
  }
  
  /* Custom Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.03); opacity: 0.9; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.70);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.80);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .sparkle {
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    pointer-events: none;
  }
  
  body {
    background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%);
    color: #374151;
  }
  
  input { transition: all 0.2s ease-in-out; }
  
  input:focus {
    border-color: #4B5563;
    box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.3);
    outline: none;
  }
  
  /* Loading overlay styles */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  .loading-overlay.active {
    opacity: 1;
    visibility: visible;
  }
  
  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(75, 85, 99, 0.1);
    border-left-color: #4B5563;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  .form-disabled {
    pointer-events: none;
    opacity: 0.7;
  }
`;

/**
 * React Functional Component for the FI MCP Server Login Page.
 * @param {object} props - Component props.
 * @param {string | null} props.error - An error message to display conditionally (replaces EJS logic).
 */
const McpLoginPage = ({ error = null }) => {
  // State to manage the loading overlay visibility
  const [isLoading, setIsLoading] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'MCP Login | Finarrator';
  }, []);

  // ----------------------------------------------------------------------
  // 2. JavaScript Logic (converted to useEffect and function)
  // ----------------------------------------------------------------------

  // Equivalent to the sparkle effect script block (on DOMContentLoaded)
  useEffect(() => {
    const container = document.querySelector('body');
    if (!container) return;
    
    const sparkleCount = 12;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      const size = Math.random() * 3 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      
      sparkle.style.left = `${Math.random() * vw}px`;
      sparkle.style.top = `${Math.random() * vh}px`;
      
      sparkle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`;
      sparkle.style.opacity = Math.random() * 0.4 + 0.1;
      
      container.appendChild(sparkle);
    }

    // Cleanup function: Removes all dynamically created sparkle elements when the component unmounts
    return () => {
      document.querySelectorAll('.sparkle').forEach(s => s.remove());
    };
  }, []);

  // Form submission handler to activate the loading overlay
  const handleSubmit = (e) => {
    // We do NOT call e.preventDefault() because the form relies on a traditional
    // browser POST to the backend route (/Fi-MCP/login) for the next page.
    setIsLoading(true);
    // The form will automatically submit after this function returns
  };

  // ----------------------------------------------------------------------
  // 3. JSX Render
  // ----------------------------------------------------------------------

  return (
    <>
      {/* Inject Custom Styles and Remixicon URL */}
      <style>{customStyles}</style>
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      
      {/* Loading Overlay (Controlled by React State) */}
      <div className={`loading-overlay ${isLoading ? 'active' : ''}`}>
        <div className="loading-spinner animate-spin"></div>
        <p className="loading-text">Connecting to FI MCP Server</p>
        <p className="loading-subtext">This may take a few moments. Please do not refresh the page.</p>
      </div>

      {/* Main Body Container */}
      <div className="min-h-screen overflow-x-hidden flex items-center justify-center">
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gray-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div 
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          ></div>
          <div 
            className="absolute top-1/2 right-1/2 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* MCP Login Form Section */}
        <div className="relative z-10 w-full max-w-md px-4">
          <div 
            className={`glass-effect rounded-2xl p-8 transform transition-all duration-300 animate-fade-in ${isLoading ? 'form-disabled' : ''}`}
            // We use the 'form-disabled' class for the opacity and pointer-events
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full blur-lg opacity-50 animate-pulse-slow"></div>
                <img 
                  src="https://img.icons8.com/fluency/96/000000/cloud-database.png" 
                  alt="MCP Server Icon" 
                  className="h-16 w-auto mx-auto relative z-10"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">FI MCP Server</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Secure Gateway to Financial Intelligence</p>

            {/* Conditional Error Display (EJS conversion) */}
            {error && (
              <div className="mb-6 bg-red-50 backdrop-blur-md border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                <p className="font-medium flex items-center"><i className="ri-error-warning-line mr-2"></i> Connection Error:</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form action={import.meta.env.VITE_API_BASE_URL + '/Fi-MCP/login'} method="POST" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  id="mobile"
                  placeholder="e.g., +91 9876543210" 
                  required 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800 placeholder-gray-400 text-sm" 
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password"
                  placeholder="••••••••" 
                  required 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800 placeholder-gray-400 text-sm" 
                />
              </div>

              <button 
                type="submit" 
                className="bg-[#FD976D] text-white font-semibold py-3 px-4 rounded-xl w-full transition-all duration-300 flex items-center justify-center gap-2 mb-4 text-sm hover:bg-[#FF7B4A] shadow-lg"
                disabled={isLoading} // Disable button when loading
              >
                {/* Dynamically change button content based on loading state */}
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Connecting...
                  </>
                ) : (
                  <>
                    <i className="ri-server-line"></i> Connect to FI MCP Server
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6 flex items-center justify-center">
              <i className="ri-shield-check-fill mr-1 text-green-500"></i> 
              Powered by <span className="font-semibold mx-1">FI's MCP Integration</span> 
              <span className="text-green-600 font-medium mx-1">• Secure</span> 
              <span className="text-blue-600 font-medium mx-1">• Encrypted</span>
            </p>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              © 2023 Finarrator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default McpLoginPage;