import React, { useEffect } from 'react';
// import './FinarratorLandingPage.css'; // Recommended: Put complex CSS/Keyframes here

// Note: For a real-world app, you should move the extensive custom CSS
// and keyframes into FinarratorLandingPage.css or use a CSS-in-JS library.
// For the "single file" request, I'll include the necessary CSS.

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

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
  }

  .gradient-bg { background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 30%, #E5E7EB 100%); }

  .gradient-text {
    background: linear-gradient(135deg, #4B5563 0%, #6B7280 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-gradient { background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%); }

  .glass-effect {
    background: rgba(255, 255, 255, 0.70);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.80);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .feature-card { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(107, 114, 128, 0.15); }

  .sparkle {
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    pointer-events: none;
  }

  .btn-primary { background: linear-gradient(135deg, #4B5563 0%, #6B7280 100%); transition: all 0.3s ease; color: white; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(75, 85, 99, 0.3); }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.80);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    color: #4B5563;
    border: 1px solid rgba(156, 163, 175, 0.3);
  }
  .btn-secondary:hover { background: rgba(255, 255, 255, 0.95); transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(75, 85, 99, 0.1); }

  .stat-card { transition: all 0.3s ease; }
  .stat-card:hover { transform: translateY(-3px); }

  body {
    background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%);
    color: #374151;
  }

  .hero-gradient { background: linear-gradient(135deg, #fdebd7 0%, #fcd5b5 100%); }

  .floating-element { animation: float 8s ease-in-out infinite; }
  .floating-element-delayed { animation: float 8s ease-in-out infinite; animation-delay: 2s; }

  .dashboard-card {
    background: linear-gradient(165deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .dashboard-card:hover { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-10px); box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3); }

  .nav-link { position: relative; }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #FD976D, #FF7B4A);
    transition: width 0.3s ease;
  }
  .nav-link:hover::after { width: 100%; }

  .shine-effect { position: relative; overflow: hidden; }
  .shine-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  .shine-effect:hover::before { left: 100%; }
`;

const Register = () => {
  useEffect(() => {
    document.title = 'Home | Finarrator';
  }, []);

  useEffect(() => {
    // Sparkle effect logic is moved into useEffect for React component mounting
    const container = document.querySelector('body');
    const sparkleCount = 15;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');

      const size = Math.random() * 4 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      sparkle.style.left = `${Math.random() * 100}vw`;
      sparkle.style.top = `${Math.random() * 100}vh`;
      sparkle.style.animation = `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`;
      sparkle.style.opacity = Math.random() * 0.4 + 0.1;

      container.appendChild(sparkle);
    }
    
    // Cleanup function to remove sparkles when the component unmounts
    return () => {
      document.querySelectorAll('.sparkle').forEach(sparkle => sparkle.remove());
    };
  }, []);

  return (
    <>
      {/* Inject custom styles/animations into the head of the document */}
      <style>{customStyles}</style>
      
      {/* Links to Tailwind and Remixicon are assumed to be in the index.html or equivalent */}
      
      <div className="min-h-screen overflow-x-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gray-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/2 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="hero-gradient ml-10 mr-10 mt-5 rounded-[40px] overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FD976D]/10 rounded-full -translate-y-48 translate-x-48 floating-element"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FD976D]/5 rounded-full translate-y-40 -translate-x-40 floating-element-delayed"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-6 h-6 rounded-full bg-[#FD976D]/20 floating-element"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#FD976D]/30 floating-element-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full bg-[#FD976D]/20 floating-element" style={{ animationDelay: '4s' }}></div>
          
          {/* Navigation */}
          <nav className="relative z-20 py-6 px-8 pt-10">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <img src="https://imgs.search.brave.com/rL3DaQCbdE4rBfy3jVQQQZagNrCD_8zFSnWIQibcbQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC83/Ni83MC9vdmVybGFw/cGluZy1wYXBlci1m/LWxvZ28tdmVjdG9y/LTI3Mjk3NjcwLmpw/Zw" alt="" className="rounded-full h-16 w-auto" />
                <span className="text-2xl font-bold text-zinc-900 ml-5">Finarrator</span>
              </div>

              <div className="hidden md:flex space-x-10">
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium nav-link">Features</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium nav-link">About</a>
              </div>

              <div className="flex items-center space-x-6">
                <a href="/login" className="text-zinc-900 transition-colors font-medium hidden md:block hover:text-[#FD976D] duration-300">
                  Sign In
                </a>
                <a href="/signup" className="bg-[#FD976D] hover:bg-[#FF7B4A] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg shine-effect">
                  Get Started
                  <i className="ri-arrow-right-line ml-2"></i>
                </a>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="relative z-10 pt-8 pb-24 px-8 flex items-center">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="text-left animate-fade-in lg:w-1/2">
                  <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-8 leading-tight">
                    Intelligent <span className="text-[#FD976D]">Financial</span> Management Platform
                  </h1>
                  
                  <p className="text-xl text-zinc-800 mb-10 max-w-xl font-light leading-relaxed">
                    Advanced AI-powered insights to optimize your financial decisions, maximize savings, and achieve your financial goals with confidence.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 mb-12">
                    <a href="/signup" className="bg-[#FD976D] hover:bg-[#FF7B4A] text-white font-medium py-4 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg shine-effect text-center flex items-center justify-center">
                      Start Free Trial
                      <i className="ri-arrow-right-line ml-3"></i>
                    </a>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="dashboard-card rounded-3xl p-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-shimmer"></div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden relative z-10">
                      <div className="p-5 border-b border-gray-700/60 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></div>
                        <div className="flex-1 text-center text-gray-400 text-sm font-medium">dashboard.finarrator.com</div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-5 mb-5">
                          <div className="bg-gray-700/40 rounded-xl p-5 backdrop-blur-sm">
                            <div className="text-gray-400 text-sm mb-3 flex items-center">
                              <i className="ri-arrow-up-line text-emerald-400 mr-1"></i> Income
                            </div>
                            <div className="text-white font-semibold text-2xl">$12,458</div>
                            <div className="text-emerald-400 text-xs flex items-center mt-2">
                              <i className="ri-arrow-up-line mr-1"></i> 12.4%
                            </div>
                          </div>
                          <div className="bg-gray-700/40 rounded-xl p-5 backdrop-blur-sm">
                            <div className="text-gray-400 text-sm mb-3 flex items-center">
                              <i className="ri-arrow-down-line text-amber-400 mr-1"></i> Expenses
                            </div>
                            <div className="text-white font-semibold text-2xl">$8,234</div>
                            <div className="text-amber-400 text-xs flex items-center mt-2">
                              <i className="ri-arrow-down-line mr-1"></i> 3.2%
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-5 border border-blue-500/30 backdrop-blur-sm">
                          <div className="text-white text-sm mb-3 flex items-center">
                            <i className="ri-pie-chart-line text-blue-400 mr-2"></i> Monthly Savings
                          </div>
                          <div className="text-white font-bold text-2xl mb-2">$4,224</div>
                          <div className="h-2 bg-gray-700/60 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 w-3/4 rounded-full"></div>
                          </div>
                          <div className="text-gray-400 text-xs mt-2 flex justify-between">
                            <span>Your goal: $5,600</span>
                            <span className="text-blue-300">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Features Section */}
        <section className="relative z-10 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Powerful Financial Intelligence</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Advanced AI-powered tools designed to transform how you manage and understand your finances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards (Rendered here, keeping the same structure) */}
              {[
                { title: 'Unified Financial Dashboard', icon: 'ri-dashboard-line', gradient: 'from-blue-500 to-indigo-600', text: 'Brings all income, expenses, investments, EMIs, and insurance into one place, saving you from juggling multiple apps and spreadsheets.' },
                { title: 'AI-Powered Personalized Advice', icon: 'ri-ai-generate', gradient: 'from-purple-500 to-fuchsia-600', text: 'Gives real-time, hyper-personalized financial guidance based on your actual income, spending patterns, and goals – not just generic tips.' },
                { title: 'Future Mirror Simulation', icon: 'ri-eye-line', gradient: 'from-amber-500 to-orange-600', text: 'Lets you simulate "what-if" scenarios like job loss, medical emergencies, or major purchases to plan ahead with confidence.' },
                { title: 'Verified Financial Information', icon: 'ri-shield-check-line', gradient: 'from-emerald-500 to-green-600', text: 'Provides accurate answers backed by trusted sources (e.g., RBI guidelines, SEBI reports) using Retrieval-Augmented Generation (RAG).' },
                { title: 'Context-Aware Chatbot', icon: 'ri-chat-3-line', gradient: 'from-cyan-500 to-blue-600', text: 'A conversational AI that understands your financial situation and gives data-backed, easy-to-understand advice.' },
                { title: 'Data Privacy & Security First', icon: 'ri-lock-line', gradient: 'from-gray-600 to-gray-700', text: 'End-to-end encryption with OAuth 2.0 ensures sensitive financial data stays safe and private.' },
                { title: 'Easy for Everyone', icon: 'ri-user-heart-line', gradient: 'from-pink-500 to-rose-600', text: 'Simple dashboards and chat interface make it usable for both tech-savvy and non-technical users.' },
                { title: 'Real-Time Performance', icon: 'ri-flashlight-line', gradient: 'from-teal-500 to-cyan-600', text: 'Instant insights and alerts powered by Google Cloud, ensuring fast, low-latency responses.' },
                { title: 'Social & Economic Impact', icon: 'ri-earth-line', gradient: 'from-violet-500 to-purple-600', text: 'Promotes financial literacy, smarter money management, and builds trust in digital finance while being eco-friendly.' },
              ].map((feature, index) => (
                <div key={index} className="glass-effect rounded-2xl p-8 feature-card group">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${feature.icon} text-2xl text-white`}></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="relative z-10 py-24 px-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">Ready to Transform Your <span className="text-[#FD976D]">Financial Strategy</span>?</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">Join thousands of industry leaders who trust Finarrator for their financial intelligence needs</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/signup" className="bg-[#FD976D] hover:bg-[#FF7B4A] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
                Get Started Free
                <i className="ri-arrow-right-line ml-3 text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <footer className="relative z-10 bg-gray-50 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Brand Column */}
              <div className="md:pr-4">
                <div className="flex items-center mb-6">
                  <div className="h-10 bg-gradient-to-r from-[#FD976D] to-[#FF7B4A] rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <img src="https://imgs.search.brave.com/rL3DaQCbdE4rBfy3jVQQQZagNrCD_8zFSnWIQibcbQA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC83/Ni83MC9vdmVybGFw/cGluZy1wYXBlci1m/LWxvZ28tdmVjdG9y/LTI3Mjk3NjcwLmpw/Zw" alt="" className="rounded-full h-14 w-auto" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Finarrator</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Advanced financial intelligence for modern businesses and individuals.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-[#FD976D] transition-colors transform hover:-translate-y-1">
                    <i className="ri-twitter-fill text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#FD976D] transition-colors transform hover:-translate-y-1">
                    <i className="ri-linkedin-fill text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#FD976D] transition-colors transform hover:-translate-y-1">
                    <i className="ri-facebook-fill text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#FD976D] transition-colors transform hover:-translate-y-1">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                </div>
              </div>

              {/* Product Column */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-6 text-lg flex items-center">
                  <i className="ri-apps-line mr-2 text-[#FD976D]"></i> Product
                </h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Features
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Pricing
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Case Studies
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Testimonials
                  </a></li>
                </ul>
              </div>

              {/* Resources Column */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-6 text-lg flex items-center">
                  <i className="ri-book-open-line mr-2 text-[#FD976D]"></i> Resources
                </h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Blog
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Help Center
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Documentation
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    API
                  </a></li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-6 text-lg flex items-center">
                  <i className="ri-building-line mr-2 text-[#FD976D]"></i> Company
                </h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    About Us
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Careers
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Contact
                  </a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#FD976D] transition-colors text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity mr-1 text-[#FD976D]"></i>
                    Legal
                  </a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2025 Finarrator. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-[#FD976D] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#FD976D] transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-[#FD976D] transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FD976D]/5 rounded-full -translate-x-12 translate-y-12"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FD976D]/5 rounded-full translate-x-12 -translate-y-8"></div>
        </footer>
      </div>
    </>
  );
};

export default Register;