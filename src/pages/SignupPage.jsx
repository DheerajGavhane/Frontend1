import React, { useEffect, useState } from 'react';

// Custom CSS and Keyframes are defined here as a string.
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
  }
  
  /* Custom Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.03);
      opacity: 0.9;
    }
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse 4s ease-in-out infinite;
  }
  
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
  
  input {
    transition: all 0.2s ease-in-out;
  }
  
  input:focus {
    border-color: #4B5563;
    box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.3);
    outline: none;
  }

  /* Assuming Remixicon is linked in index.html for a Vite project */
`;

/**
 * React Functional Component for the Signup Page.
 * @param {object} props - Component props.
 * @param {string | null} props.error - An initial error message to display (optional).
 */
const SignupPage = ({ error: initialError = null }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Sign Up | Finarrator';
  }, []);

  // Sparkle Effect useEffect Hook
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
      
      // Calculate viewport dimensions
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      
      sparkle.style.left = `${Math.random() * vw}px`;
      sparkle.style.top = `${Math.random() * vh}px`;
      
      sparkle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`;
      sparkle.style.opacity = Math.random() * 0.4 + 0.1;
      
      container.appendChild(sparkle);
    }

    return () => {
      document.querySelectorAll('.sparkle').forEach(s => s.remove());
    };
  }, []);

  // Handle form submission asynchronously
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = response.headers.get('content-type');
      const data = (contentType && contentType.includes('application/json')) 
                   ? await response.json() 
                   : { error: 'Server error or unexpected response format.' };

      if (!response.ok) {
        // Handle server-side validation or Firebase errors
        throw new Error(data.error || 'Signup failed with an unknown error.');
      }

      // Success: Redirect to login page after a brief delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000); 
      
    } catch (error) {
      console.error('Signup Error:', error.message);
      // Display the specific error message, including "Failed to fetch" if connectivity failed
      setSignupError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Inject Custom Styles (Equivalent to the <head><style> block) */}
      <style>{customStyles}</style>
      
      {/* 2. Main Body Container (Replaces <body> and its classes) */}
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

        {/* Signup Form Section */}
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="glass-effect rounded-2xl p-8 transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full blur-lg opacity-50 animate-pulse-slow"></div>
                <img 
                  src="https://img.icons8.com/fluency/96/000000/add-user-male.png" 
                  alt="Signup Icon" 
                  className="h-16 w-auto mx-auto relative z-10"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Join Finarrator's Financial Ecosystem</p>

            {/* 3. Conditional Rendering of Error */}
            {signupError && (
              <div className="mb-6 bg-red-50 backdrop-blur-md border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                <p className="font-medium flex items-center">
                  <i className="ri-error-warning-line mr-2"></i> Registration Error:
                </p>
                <p className="mt-1">{signupError}</p>
              </div>
            )}

            {/* 4. Form Structure - Uses state and handleSubmit */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  placeholder="e.g., name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800 placeholder-gray-400 text-sm" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#FD976D] text-white font-semibold py-3 px-4 rounded-xl w-full transition-all duration-300 flex items-center justify-center gap-2 mb-4 text-sm hover:bg-[#FF7B4A] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i> 
                ) : (
                    <i className="ri-user-add-line"></i>
                )}
                 {isLoading ? 'Processing...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">Already have an account? 
                <a href="/login" className="text-gray-800 hover:text-gray-900 font-semibold">Log in here</a>
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6 flex items-center justify-center">
              <i className="ri-shield-check-fill mr-1 text-green-500"></i> 
              Powered by <span className="font-semibold mx-1">Finarrator</span> 
              <span className="text-green-600 font-medium mx-1">• Secure</span> 
              <span className="text-blue-600 font-medium mx-1">• Encrypted</span>
            </p>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              © 2025 Finarrator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;