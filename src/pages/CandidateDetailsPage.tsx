// CandidateDetailsPage.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CANDIDATE_DETAILS } from '../api/queries';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { Rating } from 'react-simple-star-rating';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CandidateDetailsPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { loading, error, data } = useQuery(GET_CANDIDATE_DETAILS, {
    variables: { candidateId }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.candidateDetails) return <div>Candidate not found</div>;

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
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
      {/* Header Section */}
      <div className="bg-gray-700 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {candidate.student.user.firstName.charAt(0)}{candidate.student.user.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{candidateName}</h1>
            <p className="text-gray-600">{positionDetails.name} Candidate</p>
            <p className="text-gray-500">{candidate.student.institution.name}</p>
            
            {electionResults?.isWinner && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                <span className="mr-1">🏆</span> Election Winner
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Election Info */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Election Details</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Election:</span> {electionDetails.name}</p>
              <p><span className="font-semibold">Status:</span> {electionDetails.status}</p>
              <p><span className="font-semibold">Position:</span> {positionDetails.name}</p>
              <p><span className="font-semibold">Institution:</span> {positionDetails.institution.name}</p>
              <p><span className="font-semibold">Level:</span> {positionDetails.level.level}</p>
            </div>
          </div>

          {/* Results */}
          {electionResults && (
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Election Results</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Total Votes:</span> {electionResults.total_votes}</p>
                <p><span className="font-semibold">Vote Percentage:</span> {electionResults.percentage}%</p>
                <p><span className="font-semibold">Rank:</span> {electionResults.position_rank}</p>
              </div>
            </div>
          )}

          {/* Manifesto */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manifesto</h2>
            <p className="text-gray-700">{candidate.manifesto || 'No manifesto provided'}</p>
          </div>
        </div>

        {/* Right Column - Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vote Time Series */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Daily Votes</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={voteStatistics.voteTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="voteCount" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vote Distribution */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Vote Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={voteStatistics.voteDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="voteCount"
                    label={({ name, votePercentage }) => `${name} (${votePercentage.toFixed(1)}%)`}
                  >
                    {voteStatistics.voteDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={entry.isWinner ? '#FFD700' : '#fff'}
                        strokeWidth={entry.isWinner ? 3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} votes (${props.payload.votePercentage.toFixed(1)}%)`,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cumulative Votes */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Cumulative Votes</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={voteStatistics.cumulativeVotes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="voteCount" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Institutional Breakdown */}
          <div className="bg-gray-700 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Institutional Support</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="10%" 
                  outerRadius="80%" 
                  data={voteStatistics.institutionalBreakdown}
                >
                  <RadialBar 
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="votePercentage"
                  >
                    {voteStatistics.institutionalBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RadialBar>
                  <Legend />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${props.payload.voteCount} votes (${value}%)`,
                      props.payload.institutionName
                    ]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>


{/* Competitors */}
{competitors.length > 0 && (
  <div className="bg-gray-700 rounded-lg shadow p-6">
    <h2 className="text-xl font-bold mb-4">Competitors</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((competitor, index) => (
        <Link to={`/candidate/${competitor.id}`} key={competitor.id}>
          <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                {competitor.student.user.firstName.charAt(0)}{competitor.student.user.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {competitor.student.user.firstName} {competitor.student.user.lastName}
                </h3>
                <p className="text-sm text-gray-400">
                  {competitor.student.institution.name}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm text-gray-300">
              <span>Votes: {competitor.voteCount || 0}</span>
              <span>{competitor.votePercentage?.toFixed(1)}%</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}


          {/* Ratings (for winners) */}
          {leaderInfo && ratings.length > 0 && (
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Ratings & Feedback</h2>
              <div className="space-y-4">
                {ratings.map(rating => (
                  <div key={rating.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {rating.student.user.firstName} {rating.student.user.lastName}
                        </p>
                        <Rating 
                          initialValue={rating.score} 
                          readonly 
                          size={20} 
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(rating.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="mt-2 text-gray-700">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promises (for winners) */}
          {leaderInfo && promises.length > 0 && (
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Promise Tracker</h2>
              <div className="space-y-4">
                {promises.map(promise => (
                  <div key={promise.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{promise.title}</h3>
                    <p className="text-gray-700 mt-1">{promise.description}</p>
                    
                    {promise.promiseUpdates?.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {promise.promiseUpdates.map(update => (
                          <div key={update.id} className="pl-3 border-l-2 border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                update.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                update.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                update.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {update.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(update.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">{update.update}</p>
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
  );
};

export default CandidateDetailsPage;