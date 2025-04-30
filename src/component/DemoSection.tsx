import React, { useState } from 'react';
import CollegeRadialChart from '../components/chart/CollageRadialChart';
import VotingActivityChart from '../components/chart/VotingActivityChart';
import CandidateComparisonChart from '../components/chart/CandidateComparisonChart';

const DemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('results');

  // Sample dat
  const collegeData = [
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

  const candidateData = [
    { name: 'John Doe', votes: 1245, department: 'Engineering' },
    { name: 'Jane Smith', votes: 982, department: 'Science' },
    { name: 'Alex Johnson', votes: 756, department: 'Arts' },
    { name: 'Sarah Williams', votes: 1103, department: 'Business' }
  ];

  return (
    <div className="relative bg-gray-900 py-16 lg:py-24 overflow-hidden">
      {/* ... (keep your existing header code) ... */}

      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-5 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'results' ? 'border-[#FFE31A] text-[#FFE31A]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              College Results
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex-1 py-5 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'trends' ? 'border-[#FFE31A] text-[#FFE31A]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              Voting Trends
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex-1 py-5 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'candidates' ? 'border-[#FFE31A] text-[#FFE31A]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              Candidates
            </button>
          </nav>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'results' && (
            <div className="h-96">
              <CollegeRadialChart data={collegeData} />
            </div>
          )}
          {activeTab === 'trends' && (
            <div className="h-96">
              <VotingActivityChart data={timeData} />
            </div>
          )}
          {activeTab === 'candidates' && (
            <div className="h-96">
              <CandidateComparisonChart data={candidateData} />
            </div>
          )}
        </div>
      </div>

      {/* ... (keep your existing footer code) ... */}
    </div>
  );
};

export default DemoSection;