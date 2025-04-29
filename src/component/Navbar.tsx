import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md py-2 border-b border-gray-800 shadow-lg' : 'bg-gray-900/80 backdrop-blur-sm py-4 border-b border-gray-800/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#FFE31A]">CampusVote</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FFE31A]/10 text-[#FFE31A]">
                BETA
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-6">
                <Link 
                  to="/features" 
                  className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                >
                  Features
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FFE31A] transition-all duration-300 group-hover:w-3/4"></span>
                </Link>
                <Link 
                  to="/demo" 
                  className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                >
                  Live Demo
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FFE31A] transition-all duration-300 group-hover:w-3/4"></span>
                </Link>
                <Link 
                  to="/election-list" 
                  className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                >
                  Elections
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FFE31A] transition-all duration-300 group-hover:w-3/4"></span>
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                >
                  About
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FFE31A] transition-all duration-300 group-hover:w-3/4"></span>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link 
                to="/login" 
                className="bg-[#FFE31A] text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;