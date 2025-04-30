// src/components/sections/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PositionResults from './CollegesResults';
import CollegeList from '../pages/CollegeList';

function HeroSection() {
  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Modern Campus</span>
            <span className="block text-[#FFE31A]">Election System</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A transparent, secure, and interactive platform for student elections with real-time analytics and visualization.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link 
                to="/demo" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#FFE31A] hover:bg-yellow-400"
              >
                Live Demo
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link 
                to="/features" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <PositionResults positionId={0} />

      <CollegeList/>
    </div>
  );
}

export default HeroSection;
