// src/components/sections/DemoSection.tsx
import React, { useState } from 'react';
import { ComparativeBarChart } from './charts/ComparativeBarChart';
import { TimeSeriesLineChart } from './charts/TimeSeriesLineChart';

const DemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('university');

  // Sample data for demo
  const universityData = [
    { name: 'Engineering', votes: 1245 },
    { name: 'Science', votes: 982 },
    { name: 'Arts', votes: 756 },
    { name: 'Business', votes: 1103 }
  ];

  const timeData = [
    { date: 'Day 1', value: 450 },
    { date: 'Day 2', value: 1200 },
    { date: 'Day 3', value: 1800 },
    { date: 'Day 4', value: 2200 },
    { date: 'Today', value: 1500 }
  ];

  return (
    <div className="bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Interactive Dashboard</span>
            <span className="block text-[#FFE31A]">See it in action</span>
          </h2>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('university')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'university' ? 'border-[#FFE31A] text-[#FFE31A]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                University Results
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'trends' ? 'border-[#FFE31A] text-[#FFE31A]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              >
                Voting Trends
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'university' && (
              <div className="h-96">
                <ComparativeBarChart
                  data={universityData}
                  title="Votes by College"
                  xAxisLabel="College"
                  yAxisLabel="Votes"
                />
              </div>
            )}
            {activeTab === 'trends' && (
              <div className="h-96">
                <TimeSeriesLineChart
                  data={timeData}
                  title="Voting Activity Over Time"
                  xAxisLabel="Day"
                  yAxisLabel="Votes"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">
            This is a live demo using sample data. Sign up to see real data from your institution.
          </p>
          <button className="bg-[#FFE31A] text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-yellow-400">
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;