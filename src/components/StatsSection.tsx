// src/components/sections/StatsSection.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ELECTION_STATS } from '../api/queries';
import { RadialBarChartComponent } from './charts/RadialBarChart';

const StatsSection: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ELECTION_STATS);

  const stats = [
    { name: 'Active Elections', value: data?.electionStats?.activeElections || 0 },
    { name: 'Total Votes Cast', value: data?.electionStats?.totalVotes || 0 },
    { name: 'Registered Voters', value: data?.electionStats?.registeredVoters || 0 },
    { name: 'Candidates', value: data?.electionStats?.totalCandidates || 0 }
  ];

  const participationData = [
    { name: 'Participation', value: data?.electionStats?.participationRate || 0 }
  ];

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
          System Statistics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Numbers */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-sm font-medium text-gray-300">{stat.name}</p>
                {loading ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-700 rounded mx-auto mt-2"></div>
                ) : (
                  <p className="text-3xl font-bold text-[#FFE31A] mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* Participation Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Overall Participation Rate</h3>
            {loading || error ? (
              <div className="animate-pulse h-64 bg-gray-700 rounded"></div>
            ) : (
              <div className="h-64">
                <RadialBarChartComponent
                  data={participationData}
                  title="Participation"
                  innerRadius={80}
                  outerRadius={120}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;