// src/components/layout/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#FFE31A]">CampusVote</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link to="/features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link to="/demo" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Live Demo
                </Link>
                <Link to="/election-list" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Elections
                </Link>
                <Link to="/college-list" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Colleges
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/login" className="bg-[#FFE31A] text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400">
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