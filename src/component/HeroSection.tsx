import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 bg-[radial-gradient(#FFE31A_0%,transparent_70%)] opacity-20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Udom Campus</span>
            <span className="block text-[#FFE31A] relative inline-block">
              Smart uchaguzi
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFE31A] transform scale-x-75"></span>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
            A transparent, secure, and interactive platform for student elections with <span className="text-[#FFE31A] font-medium">real-time analytics</span> and <span className="text-[#FFE31A] font-medium">visualization</span>.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/demo" 
              className="relative px-6 py-3.5 text-base font-medium rounded-md text-gray-900 bg-[#FFE31A] hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#FFE31A]/30"
            >
              <span className="relative z-10">Live Demo</span>
              <span className="absolute inset-0 rounded-md bg-[#FFE31A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/features" 
              className="px-6 py-3.5 text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Floating animated circles */}
      <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-[#FFE31A] opacity-10 animate-float"></div>
      <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-[#FFE31A] opacity-5 animate-float animation-delay-2000"></div>
    </div>
  );
};

export default HeroSection;