
import React from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { DASHBOARD_STATS, SUBSCRIBE_TO_ACTIVE_ELECTIONS } from '../api/queries';
import Navbar from '../components/Navbar';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVoteYea,
  faCalendarAlt,
  faUsers,
  faChartLine,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faTrophy,
  faUniversity,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardPage: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(DASHBOARD_STATS, {
    fetchPolicy: 'cache-and-network'
  });

  // Subscribe to updates for active elections
  useSubscription(SUBSCRIBE_TO_ACTIVE_ELECTIONS, {
    onSubscriptionData: () => {
      refetch();
    }
  });

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" />
        <p className="mt-4">Loading dashboard data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading dashboard: {error.message}
      </div>
    </div>
  );

  const dashboardData = data?.dashboardStats;
  const positionsWithMostContests = data?.positionsWithMostContests || [];
  const institutionsWithMostActivity = data?.institutionsWithMostActivity || [];

  // Prepare data for charts
  const electionStatusData = [
    { name: 'Active', value: dashboardData?.activeElections, icon: faChartLine },
    { name: 'Completed', value: dashboardData?.completedElections, icon: faCheckCircle },
    { name: 'Upcoming', value: dashboardData?.upcomingElections, icon: faClock }
  ];

  const institutionActivityData = institutionsWithMostActivity.map(inst => ({
    name: inst.institution.name,
    elections: inst.electionCount,
    votes: inst.voteCount,
    level: inst.institution.level.level
  })).slice(0, 5); // Only show top 5 for the chart

  const recentElectionsData = dashboardData?.recentElections?.map(election => ({
    name: election.name,
    startDate: new Date(election.startDatetime).toLocaleDateString(),
    voters: election.totalVoters,
    votes: election.totalVotesCast
  })) || [];

  // Prepare data for position contest chart
  const positionContestData = positionsWithMostContests.map(pos => ({
    name: pos.position.name,
    elections: pos.electionCount,
    candidates: pos.candidateCount,
    institution: pos.position.institution?.name || 'All'
  })).slice(0, 5); // Only show top 5 for the chart

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Election Dashboard</h1>
          <p className="text-gray-300">
            Real-time monitoring and analytics for the election system
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Elections */}
          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faVoteYea} className="text-blue-400 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Total Elections</h3>
            </div>
            <p className="text-3xl font-bold text-white">{dashboardData?.totalElections || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Across all institutions</p>
          </div>

          {/* Active Elections */}
          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-green-400 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Active Elections</h3>
            </div>
            <p className="text-3xl font-bold text-white">{dashboardData?.activeElections || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Happening right now</p>
          </div>

          {/* Total Voters */}
          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUsers} className="text-purple-400 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Total Voters</h3>
            </div>
            <p className="text-3xl font-bold text-white">{dashboardData?.totalVoters || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Registered students</p>
          </div>

          {/* Voter Turnout */}
          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-400 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Voter Turnout</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {dashboardData?.voterTurnout ? dashboardData.voterTurnout.toFixed(1) : 0}%
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {dashboardData?.totalVotesCast || 0} votes cast
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Election Status */}
          <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Election Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={electionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {electionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} elections`, 'Count']}
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Middle Column - Recent Elections */}
          <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Recent Elections</h2>
            <div className="space-y-4">
              {dashboardData?.recentElections?.map((election: any) => (
                <Link to={`/election/${election.id}`} key={election.id}>
                  <div className="bg-gray-700 m-2 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <h3 className="text-white font-bold">{election.name}</h3>
                    <div className="flex justify-between text-sm text-gray-300 mt-1">
                      <span>
                        {new Date(election.startDatetime).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        election.status === 'ACTIVE' ? 'bg-green-900 text-green-100' :
                        election.status === 'COMPLETED' ? 'bg-blue-900 text-blue-100' :
                        'bg-yellow-900 text-yellow-100'
                      }`}>
                        {election.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-gray-400">
                        {election.totalVoters} voters
                      </span>
                      <span className="text-gray-400">
                        {election.totalVotesCast} votes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Active Elections */}
          <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Active Elections</h2>
            {dashboardData?.activeElectionsWithStats?.length ? (
              <div className="space-y-4">
                {dashboardData.activeElectionsWithStats.map((electionWithStats: any) => (
                  <Link to={`/election/${electionWithStats.election.id}`} key={electionWithStats.election.id}>
                    <div className="bg-gray-700 m-2 p-3 rounded-lg hover:bg-gray-600 transition-colors border-l-4 border-green-500">
                      <h3 className="text-white font-bold">{electionWithStats.election.name}</h3>
                      <div className="flex justify-between text-sm text-gray-300 mt-1">
                        <span>
                          {electionWithStats.election.institution?.name || 'All Institutions'}
                        </span>
                        <span className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          LIVE
                        </span>
                      </div>
                      {electionWithStats.stats && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${electionWithStats.stats.voterTurnout}%` 
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-400">
                              {electionWithStats.stats.voterTurnout.toFixed(1)}% turnout
                            </span>
                            <span className="text-gray-400">
                              {electionWithStats.stats.totalVotesCast} votes
                            </span>
                          </div>
                        </div>
                      )}
                      {electionWithStats.leadingCandidates?.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="text-gray-400">Current leader:</p>
                          <p className="text-white truncate">
                            {electionWithStats.leadingCandidates[0].student.user.firstName}{' '}
                            {electionWithStats.leadingCandidates[0].student.user.lastName}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mb-2" />
                <p>No active elections at this time</p>
              </div>
            )}
          </div>
        </div>


        {/* Recent Election Trends */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            Recent Election Trends
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={recentElectionsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="startDate" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="voters" 
                  name="Registered Voters" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="votes" 
                  name="Votes Cast" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;