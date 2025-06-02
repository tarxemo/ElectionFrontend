import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ELECTION_LIST } from '../api/queries';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ElectionListPage = () => {
  const [filters, setFilters] = useState({
    level: '',
    status: '',
    academicYear: ''
  });

  const { loading, error, data } = useQuery(GET_ELECTION_LIST, {
    variables: {
      level: filters.level || null,
      status: filters.status || null,
      academic_year: filters.academicYear || null
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4">Loading elections...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error loading elections: {error.message}
      </div>
    </div>
  );

  if (!data?.electionList) return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center text-yellow-400">
        No elections found
      </div>
    </div>
  );

  const { elections, statusDistribution, levelDistribution, yearlyTurnout } = data.electionList;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Elections</h1>
          <p className="text-xl text-gray-300">Browse and analyze all elections</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="UNIVERSITY">University</option>
                <option value="COLLEGE">College</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Academic Year</label>
              <select
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {/* You would populate this from another query in a real app */}
                <option value="1">2023-2024</option>
                <option value="2">2022-2023</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Election Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#4B5563',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Level Distribution */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-green-400 mb-4">By Institution Level</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="level" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#4B5563',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="count" name="Elections" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Turnout */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Yearly Turnout</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTurnout}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
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
                    formatter={(value) => [`${value}%`, 'Average Turnout']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="turnout" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Elections Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">All Elections</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Turnout</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Candidates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {elections.map((election) => (
                  <tr key={election.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/election/${election.id}`}
                        className="text-yellow-400 hover:text-yellow-300 font-medium"
                      >
                        {election.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        election.status === 'COMPLETED' ? 'bg-green-900 text-green-100' :
                        election.status === 'ACTIVE' ? 'bg-yellow-900 text-yellow-100' :
                        election.status === 'UPCOMING' ? 'bg-blue-900 text-blue-100' :
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {election.level.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {election.institution?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <div className="text-sm">
                        {new Date(election.startDatetime).toLocaleDateString()} -<br />
                        {new Date(election.endDatetime).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 mr-2">
                          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${election.voterTurnout}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-300">
                          {election.voterTurnout.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {election.totalCandidates}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionListPage;