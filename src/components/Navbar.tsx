import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = (
    <>
      <Link
        to="/dashboard"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        Dashboard
      </Link>
      <Link
        to="/vote"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        Vote
      </Link>
      <Link
        to="/position-list"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        Live
      </Link>
      <Link
        to="/election-list"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        Elections
      </Link>
      <Link
        to="/institution/1"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        Colleges
      </Link>
      <Link
        to="/about"
        className="text-gray-300 hover:text-[#FFE31A] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
      >
        About
      </Link>
    </>
  );

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#FFE31A] hover:animate-pulse transition duration-300">
              Udom CampusVote
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">{navLinks}</div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-[#FFE31A] transition duration-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 transition-all duration-300">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
