import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ELECTION_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ElectionDetailsPage = () => {
  const { electionId } = useParams();
  const { loading, error, data } = useQuery(GET_ELECTION_DETAILS, {
    variables: { electionId }
  });

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading election details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading election: {error.message}
      </div>
    </div>
  );

  if (!data?.electionDetails) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-yellow-400">
        Election not found
      </div>
    </div>
  );

  const election = data.electionDetails;

  const parsedCandidatePerformance = election.candidatePerformance
    ? JSON.parse(election.candidatePerformance)
    : [];

  const parsedInstitutionBreakdown = election.institutionBreakdown
    ? JSON.parse(election.institutionBreakdown)
    : [];

  const parsedTimeSeriesData = election.timeSeriesData
    ? JSON.parse(election.timeSeriesData)
    : [];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      
      {/* Election Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-gray-900 shadow-lg">
              {election.name.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">{election.name}</h1>
              <div className="text-xl text-gray-300 mb-3">
                <span className={`font-semibold ${
                  election.status === 'COMPLETED' ? 'text-green-400' :
                  election.status === 'ACTIVE' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {election.status}
                </span> Election
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {election.academicYear?.name}
                </span>
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {election.level.level}
                </span>
                {election.institution && (
                  <span className="bg-blue-900 px-3 py-1 rounded-full">
                    {election.institution.name}
                  </span>
                )}
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {new Date(election.startDatetime).toLocaleDateString()} - {new Date(election.endDatetime).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 pb-2 border-b border-gray-700">
                Election Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    election.status === 'COMPLETED' ? 'text-green-400' :
                    election.status === 'ACTIVE' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {election.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Academic Year:</span>
                  <span className="font-semibold">{election.academicYear?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Level:</span>
                  <span className="font-semibold">{election.level.level}</span>
                </div>
                {election.institution && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Institution:</span>
                    <span className="font-semibold">{election.institution.name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Start:</span>
                  <span className="font-semibold">
                    {new Date(election.startDatetime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-400">End:</span>
                  <span className="font-semibold">
                    {new Date(election.endDatetime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            {election.statistics && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-blue-400 mb-4 pb-2 border-b border-gray-700">
                  Election Statistics
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Total Voters:</span>
                    <span className="font-semibold">{election.statistics.totalVoters}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Votes Cast:</span>
                    <span className="font-semibold">{election.statistics.totalVotesCast}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Voter Turnout:</span>
                    <span className="font-semibold text-green-400">
                      {election.statistics.voterTurnout}%
                    </span>
                  </div>
                  {election.statistics.leadingCandidate && (
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-400">Leading Candidate:</span>
                      <span className="font-semibold">
                        {election.statistics.leadingCandidate.student.user.firstName} {election.statistics.leadingCandidate.student.user.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Positions Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 pb-2 border-b border-gray-700">
                Election Positions
              </h2>
              <div className="space-y-3">
                {election.positions.map(position => (
                  <Link
                    to={`/position/${position.position.id}`}
                    key={position.id}
                    className="block"
                  >
                    <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
                      <h3 className="font-semibold">{position.position.name}</h3>
                      <p className="text-sm text-gray-400">{position.position.description}</p>
                      <div className="mt-2 flex justify-between text-xs">
                        <span className="text-yellow-400">
                          {position.candidateSet?.length} candidates
                        </span>
                        <span className="text-gray-400">
                          Max: {position.maxCandidates}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Performance */}
            {parsedCandidatePerformance.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-green-400 mb-4">
                  Candidate Performance
                </h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={parsedCandidatePerformance}
                      layout="vertical"
                      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                    >
                      <CartesianGrid stroke="#4B5563" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        scale="band" 
                        stroke="#9CA3AF"
                        width={150}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value, name) => {
                          if (name === 'Votes') return [`${value} votes`, name];
                          if (name === 'Percentage') return [`${value}%`, name];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="votes" 
                        name="Votes" 
                        fill="#8884d8" 
                        barSize={20}
                      >
                        {parsedCandidatePerformance.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.is_winner ? '#FFD700' : '#8884d8'} 
                          />
                        ))}
                      </Bar>
                      <Line 
                        dataKey="percentage" 
                        name="Percentage" 
                        stroke="#ff7300" 
                        type="monotone"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Time Series Data */}
            {parsedTimeSeriesData.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-400 mb-4">
                  Voting Activity Over Time
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={parsedTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis 
                        dataKey="hour" 
                        stroke="#9CA3AF"
                        tickFormatter={(hour) => new Date(hour).toLocaleTimeString([], {hour: '2-digit'})}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        labelFormatter={(hour) => new Date(hour).toLocaleString()}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="votes" 
                        name="Hourly Votes"
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulative_votes" 
                        name="Total Votes"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Institution Breakdown */}
            {parsedInstitutionBreakdown.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">
                  Institution Participation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={parsedInstitutionBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          dataKey="votes"
                          nameKey="name"
                          label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                        >
                          {parsedInstitutionBreakdown.map((entry, index) => (
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
                          formatter={(value, name, props) => [
                            `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                            props.payload.name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={parsedInstitutionBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis 
                          dataKey="name" 
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
                          formatter={(value, name, props) => [
                            `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                            props.payload.name
                          ]}
                        />
                        <Bar 
                          dataKey="votes" 
                          name="Votes"
                          fill="#00C49F"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Winners Section */}
            {parsedCandidatePerformance.length > 0 && election.status === 'COMPLETED' && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Election Winners</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedCandidatePerformance
                  .filter(candidate => candidate.is_winner)
                  .map(winner => (
                    <Link
                      to={`/candidate/${winner.candidate_id}`}
                      key={winner.candidate_id}
                      className="block"
                    >
                      <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-400 hover:bg-gray-600 transition-colors cursor-pointer">
                        <h3 className="font-semibold text-white">{winner.name}</h3>
                        <p className="text-gray-400">{winner.position}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-300">Votes:</span>
                            <span className="ml-2 text-yellow-400 font-bold">{winner.votes}</span>
                          </div>
                          <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                            {winner.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Link>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetailsPage;