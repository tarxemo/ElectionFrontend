// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-[#FFE31A]">CampusVote</h3>
            <p className="mt-4 text-gray-300">
              A modern, transparent platform for campus elections with real-time analytics and visualization.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/features" className="text-gray-300 hover:text-white">Features</Link></li>
              <li><Link to="/demo" className="text-gray-300 hover:text-white">Demo</Link></li>
              <li><Link to="/elections" className="text-gray-300 hover:text-white">Elections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} CampusVote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;