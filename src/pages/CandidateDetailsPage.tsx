import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CANDIDATE_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { StarRatingDisplay } from '../components/StarRatingDisplay';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CandidateDetailsPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { loading, error, data } = useQuery(GET_CANDIDATE_DETAILS, {
    variables: { candidateId }
  });

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRatings, setFilteredRatings] = useState<any[]>([]);
  const ratingsPerPage = 5;

  useEffect(() => {
    if (data?.candidateDetails?.ratings) {
      const filtered = data.candidateDetails.ratings.filter((rating: { student: { user: { firstName: any; lastName: any; }; }; comment: string; }) => {
        const searchLower = searchTerm.toLowerCase();
        const name = `${rating.student.user.firstName} ${rating.student.user.lastName}`.toLowerCase();
        const comment = rating.comment ? rating.comment.toLowerCase() : '';
        
        return name.includes(searchLower) || comment.includes(searchLower);
      });
      setFilteredRatings(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [data, searchTerm]);

  // Calculate pagination
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = filteredRatings.slice(indexOfFirstRating, indexOfLastRating);
  const totalPages = Math.ceil(filteredRatings.length / ratingsPerPage);

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading candidate details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading candidate: {error.message}
      </div>
    </div>
  );

  if (!data?.candidateDetails) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-yellow-400">
        Candidate not found
      </div>
    </div>
  );

  const {
    candidate,
    electionDetails,
    positionDetails,
    competitors,
    electionResults,
    voteStatistics,
    leaderInfo,
    ratings,
    promises
  } = data.candidateDetails;

  const candidateName = `${candidate.student.user.firstName} ${candidate.student.user.lastName}`;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      
      {/* Candidate Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-gray-900 shadow-lg">
              {candidate.student.user.firstName.charAt(0)}{candidate.student.user.lastName.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">{candidateName}</h1>
              <div className="text-xl text-gray-300 mb-3">
                <span className="font-semibold">{positionDetails.name}</span> Candidate
                {electionResults?.isWinner && (
                  <span className="ml-3 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white px-3 py-1 rounded-full text-sm inline-flex items-center">
                    <span className="mr-1">🏆</span> Election Winner
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {candidate.student.institution.name}
                </span>
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {positionDetails.level.level}
                </span>
                {electionResults && (
                  <span className="bg-blue-900 px-3 py-1 rounded-full">
                    {electionResults.percentage}% of votes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Election Info Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 pb-2 border-b border-gray-700">
                Election Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Election:</span>
                  <span className="font-semibold">{electionDetails.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    electionDetails.status === 'COMPLETED' ? 'text-green-400' :
                    electionDetails.status === 'ONGOING' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {electionDetails.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Position:</span>
                  <span className="font-semibold">{positionDetails.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="font-medium text-gray-400">Institution:</span>
                  <span className="font-semibold">{positionDetails.institution.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-400">Level:</span>
                  <span className="font-semibold">{positionDetails.level.level}</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            {electionResults && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-blue-400 mb-4 pb-2 border-b border-gray-700">
                  Election Results
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Total Votes:</span>
                    <span className="font-semibold">{electionResults.total_votes}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-medium text-gray-400">Vote Percentage:</span>
                    <span className="font-semibold text-yellow-400">
                      {electionResults.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-400">Rank:</span>
                    <span className="font-semibold">
                      #{electionResults.position_rank}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Manifesto Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 pb-2 border-b border-gray-700">
                Manifesto
              </h2>
              <div className="prose prose-invert max-w-none">
                {candidate.manifesto ? (
                  <p className="text-gray-300 leading-relaxed">{candidate.manifesto}</p>
                ) : (
                  <p className="text-gray-500 italic">No manifesto provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vote Time Series */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Daily Votes
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={voteStatistics.voteTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => [`${value} votes`, 'Votes']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="voteCount" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vote Distribution */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">
                  Vote Distribution
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={voteStatistics.voteDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="voteCount"
                        label={({ votePercentage }) => `${votePercentage.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {voteStatistics.voteDistribution.map((entry: { isWinner: any; }, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke={entry.isWinner ? '#FFD700' : '#1F2937'}
                            strokeWidth={entry.isWinner ? 3 : 1}
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
                          `${value} votes (${props.payload.votePercentage.toFixed(1)}%)`,
                          name
                        ]}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Institutional Support */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <h2 className="text-2xl font-bold text-indigo-400 mb-4">
                  Institutional Support
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="20%" 
                      outerRadius="80%" 
                      data={voteStatistics.institutionalBreakdown}
                    >
                      <RadialBar 
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        dataKey="votePercentage"
                      >
                        {voteStatistics.institutionalBreakdown.map((_entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </RadialBar>
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#4B5563',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value, _name, props) => [
                          `${props.payload.voteCount} votes (${value}%)`,
                          props.payload.institutionName
                        ]}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Cumulative Votes */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Cumulative Votes
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={voteStatistics.cumulativeVotes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => [`${value} votes`, 'Total Votes']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="voteCount" 
                      stroke="#EF4444" 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competitors */}
            {competitors.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                  Competitors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competitors.map((competitor: { id: React.Key | null | undefined; isWinner: any; student: { user: { firstName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; lastName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; institution: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }; voteCount: any; votePercentage: number; }) => (
                    <Link 
                      to={`/candidate/${competitor.id}`} 
                      key={competitor.id}
                      className="transform hover:scale-[1.02] transition-transform duration-200"
                    >
                      <div className={`bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all duration-200 border-l-4 ${
                        competitor.isWinner ? 'border-yellow-400' : 'border-gray-500'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-900">
                            {String(competitor.student.user.firstName ?? '').charAt(0)}
                            {String(competitor.student.user.lastName ?? '').charAt(0)}
                          </div>


                          <div>
                            <h3 className="font-semibold text-white">
                              {competitor.student.user.firstName} {competitor.student.user.lastName}
                              {competitor.isWinner && (
                                <span className="ml-2 bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full">
                                  Winner
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {competitor.student.institution.name}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-300">Votes:</span>
                            <span className="ml-2 text-yellow-400 font-bold">
                              {competitor.voteCount || 0}
                            </span>
                          </div>
                          <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
                            {competitor.votePercentage?.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings (for winners) */}
            {leaderInfo && ratings.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  Ratings & Feedback
                </h2>
                
                {/* Search Box */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search feedback by name or comment..."
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {filteredRatings.length} feedback items found
                  </div>
                </div>
                
                {/* Ratings List */}
                <div className="space-y-4">
                  {currentRatings.length > 0 ? (
                    currentRatings.map(rating => (
                      <div 
                        key={rating.id} 
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">
                              {rating.student.user.firstName} {rating.student.user.lastName}
                            </p>
                            <StarRatingDisplay score={rating.score} />
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(rating.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="mt-2 text-gray-300">{rating.comment}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No feedback matches your search criteria
                    </div>
                  )}
                </div>
                
                {/* Pagination Controls */}
                {filteredRatings.length > ratingsPerPage && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-600'}`}
                    >
                      Previous
                    </button>
                    
                    <div className="text-gray-300">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-600'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Promises (for winners) */}
            {leaderInfo && promises.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-green-400 mb-4">
                  Promise Tracker
                </h2>
                <div className="space-y-4">
                  {promises.map((promise: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; promiseUpdates: any[]; }) => (
                    <div 
                      key={promise.id} 
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-white">{promise.title}</h3>
                      <p className="text-gray-300 mt-1">{promise.description}</p>
                      
                      {promise.promiseUpdates?.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {promise.promiseUpdates.map((update: { id: React.Key | null | undefined; status: string; timestamp: string | number | Date; update: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                            <div 
                              key={update.id} 
                              className={`pl-3 border-l-4 ${
                                update.status === 'COMPLETED' ? 'border-green-500' :
                                update.status === 'IN_PROGRESS' ? 'border-blue-500' :
                                update.status === 'FAILED' ? 'border-red-500' :
                                'border-gray-500'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  update.status === 'COMPLETED' ? 'bg-green-900 text-green-100' :
                                  update.status === 'IN_PROGRESS' ? 'bg-blue-900 text-blue-100' :
                                  update.status === 'FAILED' ? 'bg-red-900 text-red-100' :
                                  'bg-gray-600 text-gray-300'
                                }`}>
                                  {update.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(update.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-300">{update.update}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

export default CandidateDetailsPage;