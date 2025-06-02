import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_INSTITUTION_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InstitutionDetailsPage = () => {
  const { institutionId } = useParams();
  const { loading, error, data } = useQuery(GET_INSTITUTION_DETAILS, {
    variables: { institutionId }
  });

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading institution details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading institution: {error.message}
      </div>
    </div>
  );

  if (!data?.institutionDetails) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-yellow-400">
        Institution not found
      </div>
    </div>
  );

  const {
    institution,
    parentInstitution,
    childInstitutions,
    hierarchy: hierarchyString
  } = data.institutionDetails;

  // Parse all JSON string fields
  const hierarchy = JSON.parse(hierarchyString || '[]');
  const voteDistribution = institution.voteDistribution ? JSON.parse(institution.voteDistribution) : [];
  const voterTurnoutHistory = institution.voterTurnoutHistory ? JSON.parse(institution.voterTurnoutHistory) : [];
  const positionBreakdown = institution.positionBreakdown ? JSON.parse(institution.positionBreakdown) : [];
  const electionStats = institution.electionStats ? JSON.parse(institution.electionStats) : null;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      
      {/* Institution Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-gray-900 shadow-lg">
              {institution.name.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">{institution.name}</h1>
              <div className="text-xl text-gray-300 mb-3">
                <span className="font-semibold">{institution.level.level}</span> Institution
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {institution.level.level}
                </span>
                {parentInstitution && (
                  <Link 
                    to={`/institution/${parentInstitution.id}`}
                    className="bg-blue-900 px-3 py-1 rounded-full hover:bg-blue-800 transition-colors"
                  >
                    Parent: {parentInstitution.name}
                  </Link>
                )}
                {childInstitutions?.length > 0 && (
                  <span className="bg-green-900 px-3 py-1 rounded-full">
                    {childInstitutions.length} child institutions
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hierarchy Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {hierarchy.map((item: any, index: number) => (
                <li key={item.id} className="inline-flex items-center">
                  {index > 0 && (
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <Link 
                    to={`/institution/${item.id}`}
                    className={`inline-flex items-center text-sm font-medium ${index === hierarchy.length - 1 ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {item.name} ({item.level})
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 pb-2 border-b border-gray-700">
                Institution Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Level:</span>
                  <span className="font-semibold">{institution.level.level}</span>
                </div>
                {parentInstitution && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Parent Institution:</span>
                    <Link 
                      to={`/institution/${parentInstitution.id}`}
                      className="font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {parentInstitution.name}
                    </Link>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-400">Description:</span>
                  <span className="font-semibold text-right">
                    {institution.description || 'No description available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Child Institutions */}
            {childInstitutions && childInstitutions.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-blue-400 mb-4 pb-2 border-b border-gray-700">
                  Child Institutions
                </h2>
                <div className="space-y-3">
                  {childInstitutions.map((child: any) => (
                    <Link 
                      key={child.id}
                      to={`/institution/${child.id}`}
                      className="block bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold">{child.name}</h3>
                      <p className="text-sm text-gray-400">{child.level.level}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Current Leaders */}
            {institution.leaders && institution.leaders.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-green-400 mb-4 pb-2 border-b border-gray-700">
                  Current Leaders
                </h2>
                <div className="space-y-3">
                  {institution.leaders.map((leader: any) => (
                    <div 
                      key={leader.id}
                      className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold">
                        {leader.candidate.student.user.firstName} {leader.candidate.student.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-300">{leader.position.name}</p>
                      <div className="mt-2 flex justify-between text-xs">
                        <span className="text-yellow-400">
                          Since: {new Date(leader.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-400">
                          Until: {new Date(leader.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Election Statistics */}
            {electionStats && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  Latest Election Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <h3 className="text-sm text-gray-400">Total Voters</h3>
                    <p className="text-2xl font-bold text-yellow-400">
                      {electionStats.totalVoters}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <h3 className="text-sm text-gray-400">Votes Cast</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      {electionStats.totalVotesCast}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <h3 className="text-sm text-gray-400">Voter Turnout</h3>
                    <p className="text-2xl font-bold text-green-400">
                      {electionStats.voterTurnout}%
                    </p>
                  </div>
                </div>
                {voteDistribution.length > 0 && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={voteDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis 
                          dataKey="candidate" 
                          stroke="#9CA3AF"
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            borderColor: '#4B5563',
                            borderRadius: '0.5rem'
                          }}
                          formatter={(value: any, name: any, props: any) => [
                            `${value} votes (${props.payload.percentage}%)`,
                            name
                          ]}
                        />
                        <Legend />
                        <Bar 
                          dataKey="votes" 
                          name="Votes Received"
                          fill="#8884d8"
                        >
                          {voteDistribution.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.isWinner ? '#FFD700' : '#8884d8'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Voter Turnout History */}
            {voterTurnoutHistory.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-400 mb-4">
                  Voter Turnout History
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={voterTurnoutHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#9CA3AF"
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value: any, name: any) => {
                          if (name === 'Turnout') {
                            return [`${value}%`, name];
                          }
                          return [value, name];
                        }}
                        labelFormatter={(year) => `Year: ${year}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="turnout" 
                        name="Turnout"
                        stroke="#EF4444" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="votesCast" 
                        name="Votes Cast"
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Position Breakdown */}
            {positionBreakdown.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-green-400 mb-4">
                  Positions Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={positionBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          dataKey="electionsCount"
                          nameKey="position"
                          label={({ name }: any) => name}
                        >
                          {positionBreakdown.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            borderColor: '#4B5563',
                            borderRadius: '0.5rem'
                          }}
                          formatter={(value: any, name: any, props: any) => [
                            `${value} elections`,
                            props.payload.position
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center text-gray-400 mt-2">Elections per Position</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={positionBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis 
                          dataKey="position" 
                          stroke="#9CA3AF"
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            borderColor: '#4B5563',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="leadersCount" 
                          name="Leaders Count"
                          fill="#00C49F"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-gray-400 mt-2">Leaders per Position</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailsPage;