import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';

const StatsSection: React.FC = () => {
  // Hardcoded data
  const stats = [
    { name: 'Active Elections', value: 42 },
    { name: 'Total Votes Cast', value: 12563 },
    { name: 'Registered Voters', value: 18792 },
    { name: 'Candidates', value: 217 }
  ];

  const participationData = [
    {
      name: 'Participation',
      value: 67, // 67%
      fill: '#FFE31A'
    }
  ];

  return (
    <div className="relative bg-gray-900 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-[#FFE31A] mb-4">
            TRUSTED BY CAMPUSES NATIONWIDE
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            <span className="text-[#FFE31A]">By the Numbers</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Numbers */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-[#FFE31A]/30 transition-all duration-300"
              >
                <p className="text-sm font-medium text-gray-300 tracking-wider">{stat.name}</p>
                <p className="text-4xl font-bold text-[#FFE31A] mt-4 animate-count">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          
          {/* Participation Chart */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Voter Participation</h3>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FFE31A]/10 text-[#FFE31A]">
                {participationData[0].value}%
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="90%"
                  data={participationData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    animationDuration={1500}
                  />
                  <Legend 
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    wrapperStyle={{
                      paddingLeft: '20px'
                    }}
                    formatter={() => (
                      <span className="text-gray-300">
                        Participation: {participationData[0].value}%
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">
              Real-time participation data updated every 30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;