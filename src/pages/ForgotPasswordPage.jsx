import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
  }
  
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
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.80);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    color: #4B5563;
    border: 1px solid rgba(156, 163, 175, 0.3);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -5px rgba(75, 85, 99, 0.1);
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
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password | Finarrator';
  }, []);

  // Sparkle Effect
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

    return () => {
      document.querySelectorAll('.sparkle').forEach(s => s.remove());
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Password Reset Error:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Failed to send password reset email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      
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

        {/* Forgot Password Form Section */}
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="glass-effect rounded-2xl p-8 transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full blur-lg opacity-50 animate-pulse-slow"></div>
                  <img src="https://imgs.search.brave.com/rL3DaQCbdE4rBfy3jVQQQZagNrCD_8zFSnWIQibcbQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC83/Ni83MC9vdmVybGFw/cGluZy1wYXBlci1m/LWxvZ28tdmVjdG9y/LTI3Mjk3NjcwLmpw/Zw" 
                        alt="Finarrator Logo" 
                        className="h-12 w-12 rounded-full object-cover shadow-lg relative z-10"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Enter your email to receive a password reset link</p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800 placeholder-gray-400 text-sm" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#FD976D] text-white font-semibold py-3 px-4 rounded-xl w-full transition-all duration-300 flex items-center justify-center gap-2 mb-4 text-md hover:bg-[#FF7B4A] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i> 
                  ) : (
                    <i className="ri-mail-send-line"></i>
                  )}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                {error && (
                  <div className="mb-4 bg-red-50 backdrop-blur-md border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                    <p className="font-medium flex items-center">
                      <i className="ri-error-warning-line mr-2"></i> Error:
                    </p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="mb-4 bg-green-50 backdrop-blur-md border border-green-200 text-green-700 text-sm p-4 rounded-xl text-center">
                <p className="font-medium flex items-center justify-center mb-2">
                  <i className="ri-check-line mr-2 text-lg"></i> Success!
                </p>
                <p>{message}</p>
                <p className="text-xs text-green-600 mt-3">Didn't receive it? Check your spam folder or try with another email.</p>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-gray-600 text-xs">
                Remember your password? 
                <a href="/login" className="text-gray-800 hover:text-gray-900 font-semibold underline transition-colors ml-1">Back to login</a>
              </p>
            </div>
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

export default ForgotPasswordPage;
