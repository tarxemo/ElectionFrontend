// pages/PositionCompetitorsPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_POSITION_DETAILS, SUBSCRIBE_TO_VOTES, 
    GET_ACADEMIC_YEARS } from '../api/queries';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PositionCompetitorsPage: React.FC = () => {
    const { positionId, electionId } = useParams<{ positionId: string; electionId?: string }>();
    const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null);
    
    // Fetch academic years
    const { data: academicYearsData } = useQuery(GET_ACADEMIC_YEARS);
    
    const { loading, error, data, refetch } = useQuery(GET_POSITION_DETAILS, {
      variables: { 
        positionId, 
        electionId,
        academicYearId: selectedAcademicYear  // Pass selected academic year
      },
      fetchPolicy: 'cache-and-network'
    });
  
    // Subscribe to new votes if election is active
    const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_VOTES, {
      variables: { positionId, electionId },
      skip: !data?.positionDetails?.isElectionActive
    });
  
    // Handle academic year change
    const handleAcademicYearChange = (yearId: string) => {
      setSelectedAcademicYear(yearId === '' ? null : yearId);
    };

  useEffect(() => {
    if (data?.positionDetails?.voteTimeSeries) {
      const formattedData = formatTimeSeriesData(data.positionDetails.voteTimeSeries, data.positionDetails.candidates);
      setTimeSeriesData(formattedData);
      setLastUpdate(new Date());
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.voteAdded) {
      // Simulate adding a vote to our time series data
      // In a real app, you might want to refetch or update the cache
      refetch();
    }
  }, [subscriptionData, refetch]);

  const formatTimeSeriesData = (rawData: any[], candidates: any[]) => {
    // Group by timestamp
    const grouped: Record<string, any> = {};
    
    rawData.forEach(item => {
      if (!grouped[item.timestamp]) {
        grouped[item.timestamp] = {
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
        };
      }
      const candidate = candidates.find(c => c.id === item.candidateId);
      if (candidate) {
        const name = `${candidate.student.user.firstName} ${candidate.student.user.lastName}`;
        grouped[item.timestamp][name] = item.count;
      }
    });
    
    return Object.values(grouped);
  };

  const preparePieData = (candidates: any[]) => {
    return candidates.map(candidate => ({
      name: `${candidate.student.user.firstName} ${candidate.student.user.lastName}`,
      value: candidate.voteCount,
      percentage: candidate.votePercentage,
      isWinner: candidate.isWinner
    }));
  };

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading position details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading position: {error.message}
      </div>
    </div>
  );

  const positionDetails = data?.positionDetails;
  if (!positionDetails) return null;

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Position Header */}
        <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                {positionDetails.position.name}
              </h1>
              <p className="text-gray-300">
                {positionDetails.position.description}
              </p>
            </div>
            
            {/* Academic Year Selector */}
            <div className="bg-gray-800 rounded-lg p-2">
              <label htmlFor="academic-year" className="block text-sm font-medium text-gray-300 mb-1">
                Academic Year
              </label>
              <select
                id="academic-year"
                value={selectedAcademicYear || ''}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Years</option>
                {academicYearsData?.academicYears?.map((year: any) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            {positionDetails.position.name}
          </h1>
          <p className="text-gray-300 mb-4">
            {positionDetails.position.description}
          </p>
          <div className="flex flex-wrap gap-4 text-white">
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-yellow-400">Institution:</span> {positionDetails.position.institution.name}
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-yellow-400">Level:</span> {positionDetails.position.level.level}
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-yellow-400">Total Voters:</span> {positionDetails.totalVoters}
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-yellow-400">Votes Cast:</span> {positionDetails.totalVotes}
            </div>
            {positionDetails.isElectionActive && (
              <div className="bg-green-900 px-4 py-2 rounded flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                LIVE ELECTION
              </div>
            )}
          </div>
        </div>

        {/* Winner Banner (if election completed) */}
        {positionDetails.winner && (
          <div className="mb-8 bg-gradient-to-r from-yellow-600 to-yellow-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">🏆 Election Winner</h2>
            <div className="flex items-center">
              <div className="bg-white text-yellow-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                {positionDetails.winner.student.user.firstName.charAt(0)}{positionDetails.winner.student.user.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {positionDetails.winner.student.user.firstName} {positionDetails.winner.student.user.lastName}
                </h3>
                <p className="text-yellow-200">
                  Won with {positionDetails.winner.votePercentage?.toFixed(1)}% of votes ({positionDetails.winner.voteCount} votes)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidates List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Candidates</h2>
            
            {positionDetails.candidates.map((candidate: any) => (
              <div key={candidate.id} className={`bg-gray-800 rounded-lg p-4 border-l-4 ${candidate.isWinner ? 'border-yellow-400' : 'border-gray-700'}`}>
                <div className="flex items-start">
                  <div className="bg-gray-700 text-yellow-400 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4">
                    {candidate.student.user.firstName.charAt(0)}{candidate.student.user.lastName.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white">
                      {candidate.student.user.firstName} {candidate.student.user.lastName}
                      {candidate.isWinner && (
                        <span className="ml-2 bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded">WINNER</span>
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {candidate.student.institution.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-900 text-blue-100 px-2 py-1 rounded text-xs">
                        {candidate.voteCount} votes
                      </span>
                      <span className="bg-purple-900 text-purple-100 px-2 py-1 rounded text-xs">
                        {candidate.votePercentage?.toFixed(1)}%
                      </span>
                      {candidate.rating && (
                        <span className="bg-green-900 text-green-100 px-2 py-1 rounded text-xs">
                          ★ {candidate.rating.toFixed(1)} rating
                        </span>
                      )}
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {candidate.promisesCount} promises
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {candidate.manifesto || 'No manifesto provided'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Votes Over Time */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">
                Votes Over Time {positionDetails.isElectionActive && '(Live)'}
                {lastUpdate && (
                  <span className="text-sm text-gray-400 ml-2">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </span>
                )}
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                    />
                    <Legend />
                    {positionDetails.candidates.map((candidate: any, index: number) => (
                      <Line
                        key={candidate.id}
                        type="monotone"
                        dataKey={`${candidate.student.user.firstName} ${candidate.student.user.lastName}`}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vote Distribution */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Vote Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData(positionDetails.candidates)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    >
                      {positionDetails.candidates.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                        name
                      ]}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Current Standings */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">
                Current Standings
                {positionDetails.isElectionActive && ' (Live)'}
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={positionDetails.candidates
                      .map((c: any) => ({
                        name: `${c.student.user.firstName} ${c.student.user.lastName}`,
                        votes: c.voteCount,
                        percentage: c.votePercentage,
                        isWinner: c.isWinner
                      }))
                      .sort((a: any, b: any) => b.votes - a.votes)
                    }
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      stroke="#9CA3AF" 
                      tickFormatter={(value) => value.split(' ')[0]}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                        name
                      ]}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                    />
                    <Bar dataKey="votes" name="Votes">
                      {positionDetails.candidates.map((_: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke={positionDetails.candidates[index].isWinner ? '#FFD700' : ''}
                          strokeWidth={positionDetails.candidates[index].isWinner ? 2 : 0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCompetitorsPage;