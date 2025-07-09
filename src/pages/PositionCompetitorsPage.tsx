// pages/PositionCompetitorsPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_POSITION_DETAILS, SUBSCRIBE_TO_VOTES, 
  GET_ALL_ELECTIONS, 
  GET_ACADEMIC_YEARS} from '../api/queries';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Link } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PositionCompetitorsPage: React.FC = () => {
    const { positionId, electionId } = useParams<{ positionId: string; electionId?: string }>();
    const [_timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
    const [_lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null);
    const [selectedElection, setSelectedElection] = useState<string | null>(null);
    const [showCumulative, _setShowCumulative] = useState(true);
    const [timeGranularity, setTimeGranularity] = useState<'minute' | 'hour' | 'day'>('day');
    // Fetch academic years
    const { data: electionData } = useQuery(GET_ALL_ELECTIONS);
    const { data: academicYearsData } = useQuery(GET_ACADEMIC_YEARS);
    
    const { loading, error, data, refetch } = useQuery(GET_POSITION_DETAILS, {
      variables: { 
        positionId, 
        electionId: selectedElection ?? electionId ?? null,
        academicYearId: selectedAcademicYear,
        granularity: timeGranularity,  // Add this
        limit: 50  // Add this
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

    const handleElectionChange = (electionId: string) => {
      setSelectedElection(electionId === '' ? null : electionId);
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

const formatVoteRatesData = (candidates: any[]) => {
  // Create a map to store all data points by their timestamp
  const dateMap: Record<string, any> = {};
  
  candidates.forEach(candidate => {
    const candidateName = `${candidate.student.user.firstName} ${candidate.student.user.lastName}`;
    
    candidate.voteRates.forEach((rate: any) => {
      const date = new Date(rate.date);
      let timeKey: string;
      
      // Create a consistent key based on granularity
      if (timeGranularity === 'day') {
        timeKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (timeGranularity === 'hour') {
        timeKey = date.toISOString().split(':')[0] + ':00'; // YYYY-MM-DDTHH:00
      } else { // minute
        timeKey = date.toISOString().split(':').slice(0, 2).join(':') + ':00'; // YYYY-MM-DDTHH:MM:00
      }
      
      // Initialize the time point if it doesn't exist
      if (!dateMap[timeKey]) {
        dateMap[timeKey] = { 
          date: timeKey,
          formattedDate: formatDateForDisplay(timeKey, timeGranularity)
        };
      }
      
      // Add the candidate's votes for this time period
      dateMap[timeKey][candidateName] = (dateMap[timeKey][candidateName] || 0) + rate.voteCount;
    });
  });

  // Convert to array and sort chronologically
  const sortedData = Object.values(dateMap).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate cumulative totals if needed
  if (showCumulative) {
    const cumulativeTotals: Record<string, number> = {};
    
    sortedData.forEach((point: any) => {
      candidates.forEach(candidate => {
        const candidateName = `${candidate.student.user.firstName} ${candidate.student.user.lastName}`;
        cumulativeTotals[candidateName] = (cumulativeTotals[candidateName] || 0) + (point[candidateName] || 0);
        point[candidateName] = cumulativeTotals[candidateName];
      });
    });
  }

  return sortedData;
};

// Helper function to format dates for display
const formatDateForDisplay = (dateString: string, granularity: string) => {
  const date = new Date(dateString);
  
  switch (granularity) {
    case 'day':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'hour':
      return date.toLocaleTimeString('en-US', { hour: '2-digit' });
    case 'minute':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    default:
      return date.toISOString();
  }
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

  const positionDetails = data.positionDetails;
  // if (!positionDetails) return null;

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
          </div>
          <div>
            {/* Academic Year Selector */}
            <div className="bg-gray-800 rounded-lg p-2">
              <label htmlFor="academic-year" className="block text-sm font-medium text-gray-300 mb-1">
                Accademic Year
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


            <div className="bg-gray-800 rounded-lg p-2">
              <label htmlFor="academic-year" className="block text-sm font-medium text-gray-300 mb-1">
                Election
              </label>
              <select
                id="academic-year"
                value={selectedElection || ''}
                onChange={(e) => handleElectionChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">All Elections</option>
                {electionData?.allElections?.map((election: any) => (
                  <option key={election.id} value={election.id}>
                    {election.name} {election.status == "COMPLETED" ? 'completed' : 'in progress'}
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


        {positionDetails.predictedWinner && !positionDetails.winner && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 rounded-lg mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI PREDICTED WINNER
              </h2>
              <span className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                {(parseFloat(positionDetails?.predictionConfidence).toFixed(2) as unknown as number) * 10}%
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Candidate Profile */}
              <div className="flex items-center bg-gray-800 bg-opacity-50 p-4 rounded-lg flex-1">
                <div className="bg-white text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-4">
                  {positionDetails.predictedWinner.student.user.firstName.charAt(0)}
                  {positionDetails.predictedWinner.student.user.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {positionDetails.predictedWinner.student.user.fullName}
                  </h3>
                  <p className="text-blue-200">
                    {positionDetails.predictedWinner.student.institution.parent?.name || ''}
                    {positionDetails.predictedWinner.student.institution.parent?.name && ' • '}
                    {positionDetails.predictedWinner.student.institution.name}
                  </p>
                </div>
              </div>

              {/* Vote Stats */}
              <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-300 text-sm">Current Votes</p>
                    <p className="text-3xl font-bold text-white">
                      {positionDetails.predictedWinner.voteCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Vote Percentage</p>
                    <p className="text-3xl font-bold text-white">
                      {positionDetails.predictedWinner.votePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-blue-300 text-sm mb-1">Prediction Confidence</p>
                  <div className="w-full bg-blue-900 bg-opacity-50 rounded-full h-3">
                    <div 
                      className="bg-blue-400 h-3 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, parseFloat(positionDetails.predictionConfidence) * 10)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Voting Trend */}
              <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg flex-1">
                <h4 className="text-blue-200 text-sm font-semibold mb-2">VOTING TREND</h4>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={positionDetails.predictedWinner.voteRates
                        .map((rate: { date: string | number | Date; voteCount: any; }) => ({
                          date: new Date(rate.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          votes: rate.voteCount
                        }))
                        .reverse()
                      }
                    >
                      <defs>
                        <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="votes" 
                        stroke="#60A5FA" 
                        fillOpacity={1} 
                        fill="url(#colorVotes)" 
                      />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: '#BFDBFE' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E40AF',
                          borderColor: '#3B82F6',
                          borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: '#EFF6FF' }}
                        formatter={(value) => [`${value} votes`, 'Votes']}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Prediction Disclaimer */}
            <div className="mt-4 text-blue-200 text-xs italic">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              This prediction is based on current voting patterns and historical data. Actual results may vary.
            </div>
          </div>
        )}


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

{/* Cumulative Votes Over Time */}
<div className="bg-gray-800 p-4 rounded-lg mb-8">
  <h2 className="text-xl font-bold text-yellow-400 mb-4">
    Cumulative Votes Over Time
  </h2>


{/* Granularity Selector */}
<div className="flex gap-2 mb-4">
  <button 
    onClick={() => setTimeGranularity('minute')}
    className={`px-3 py-1 rounded ${timeGranularity === 'minute' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
  >
    Per Minute
  </button>
  <button 
    onClick={() => setTimeGranularity('hour')}
    className={`px-3 py-1 rounded ${timeGranularity === 'hour' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
  >
    Per Hour
  </button>
  <button 
    onClick={() => setTimeGranularity('day')}
    className={`px-3 py-1 rounded ${timeGranularity === 'day' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
  >
    Per Day
  </button>
</div>

  <div className="h-200">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={formatVoteRatesData(positionDetails.candidates)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >


        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis 
  dataKey="formattedDate" 
  stroke="#9CA3AF" 
  tickFormatter={(date) => {
    const d = new Date(date);
    if (timeGranularity === 'day') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (timeGranularity === 'hour') {
      return d.toLocaleTimeString('en-US', { hour: '2-digit' });
    } else {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }}
/>
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
  labelFormatter={(dateKey) => {
    const date = new Date(dateKey);
    if (timeGranularity === 'day') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }}
  formatter={(value, name) => [`${value} votes`, name]}
/>
        <Legend />
        {positionDetails.candidates.map((candidate: any, index: number) => (
          <Line
            key={candidate.id}
            type="monotone"
            dataKey={`${candidate.student.user.firstName} ${candidate.student.user.lastName}`}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidates List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Candidates</h2>
            

{positionDetails.candidates.map((candidate: any) => (
  <Link to={`/candidate/${candidate.id}`} key={candidate.id}>
    <div className={`bg-gray-800 rounded-lg m-4 p-4 border-l-4 cursor-pointer hover:bg-gray-700 transition-all duration-200 ${candidate.isWinner ? 'border-yellow-400' : 'border-gray-700'}`}>
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
  </Link>
))}

          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Votes Over Time */}
            
<div className="bg-gray-800 p-4 rounded-lg">
  <h2 className="text-xl font-bold text-yellow-400 mb-4">
    Vote Share Distribution
    {positionDetails.winner && (
      <span className="text-sm text-gray-400 ml-2">
        (Winner: {positionDetails.winner.votePercentage?.toFixed(1)}%)
      </span>
    )}
  </h2>
  <div className="h-128 flex">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={preparePieData(positionDetails.candidates)}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ percentage }) => `${percentage.toFixed(1)}%`}
          labelLine={false}
        >
          {positionDetails.candidates.map((candidate: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              stroke={candidate.isWinner ? '#FFD700' : '#1F2937'}
              strokeWidth={candidate.isWinner ? 3 : 1}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string, props: any) => [
            `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
            name
          ]}
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            borderColor: '#4B5563',
            borderRadius: '0.5rem'
          }}
        />
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle"
          formatter={(value, _entry, index) => (
            <span className={positionDetails.candidates[index].isWinner ? "text-yellow-400" : "text-gray-300"}>
              {value}
            </span>
          )}
        />
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
              <div className="h-140">
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