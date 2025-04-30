// pages/PositionsPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { 
  GET_ALL_POSITIONS, 
  GET_POSITION_STATS, 
  GET_ACADEMIC_YEARS, 
  GET_ALL_INSTITUTIONS 
} from '../api/queries';
import Navbar from '../components/Navbar';
import { PositionStatsChart } from '../components/charts/PositionStatsChart';
import { Link } from 'react-router-dom';

interface Position {
  id: string;
  name: string;
  description: string;
  level: {
    level: string;
  };
  institution: {
    id: string;
    name: string;
    level: {
      level: string;
    };
    parent?: {
      id: string;
      name: string;
    };
  };
  electionCount: number;
  candidateCount: number;
}

interface Institution {
  id: string;
  name: string;
  children?: Institution[];
}

const PositionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    institutionId: '',
    academicYearId: '',
    hasElections: false,
    hasCandidates: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; name: string }>>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const { data: institutionsData } = useQuery(GET_ALL_INSTITUTIONS);
  const { data: academicYearsData } = useQuery(GET_ACADEMIC_YEARS);
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSITIONS, {
    variables: {
      filters: {
        search: searchTerm,
        ...filters,
      },
      first: itemsPerPage,
      skip: page * itemsPerPage,
    },
  });
  const { data: statsData } = useQuery(GET_POSITION_STATS);

  useEffect(() => {
    if (institutionsData?.allInstitutions) {
      setInstitutions(institutionsData.allInstitutions);
    }
  }, [institutionsData]);

  useEffect(() => {
    if (academicYearsData?.academicYears) {
      setAcademicYears(academicYearsData.academicYears);
    }
  }, [academicYearsData]);

  const getInstitutionsBySelectedLevel = () => {
    if (!filters.level) return [];

    if (filters.level === 'UNIVERSITY') {
      return institutions;
    }

    if (filters.level === 'COLLEGE') {
      return institutions.flatMap(u => u.children || []);
    }

    if (filters.level === 'HOSTEL') {
      return institutions.flatMap(u =>
        u.children?.flatMap(c => c.children || []) || []
      );
    }

    return [];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      level: '',
      institutionId: '',
      academicYearId: '',
      hasElections: false,
      hasCandidates: false,
    });
  };

  const positions: Position[] = data?.allPositions || [];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Election Positions</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-[#FFE31A] text-gray-900 rounded transition"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Search */}
        <div className="p-4 mb-6 bg-gray-800 rounded-lg">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Level */}
              <div className="bg-gray-700 rounded p-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                <select
                  value={filters.level}
                  onChange={e => handleFilterChange('level', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Levels</option>
                  <option value="UNIVERSITY">University</option>
                  <option value="COLLEGE">College</option>
                  <option value="HOSTEL">Hostel</option>
                </select>
              </div>

              {/* Institution */}
              <div className="bg-gray-700 rounded p-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                <select
                  value={filters.institutionId}
                  onChange={e => handleFilterChange('institutionId', e.target.value)}
                  disabled={!filters.level}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  <option value="">All Institutions</option>
                  {getInstitutionsBySelectedLevel().map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="bg-gray-700 rounded p-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Academic Year</label>
                <select
                  value={filters.academicYearId}
                  onChange={e => handleFilterChange('academicYearId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Years</option>
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-2 p-2">
                <button
                  onClick={() => refetch()}
                  className="w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-400 text-white rounded hover:bg-gray-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {statsData?.positionStats && (
          <div className="p-4 mb-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Position Statistics</h2>
            <PositionStatsChart data={statsData.positionStats} />
          </div>
        )}

        {/* Positions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-red-400">
              Error loading positions: {error.message}
            </div>
          ) : positions.length === 0 ? (
            <div className="col-span-full text-white">
              No positions found matching your criteria.
            </div>
          ) : (
            positions.map(position => (
              <Link
                to={`/position/${position.id}`}
                key={position.id}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col p-4 hover:ring-2 hover:ring-yellow-400 transition"
              >
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{position.name}</h3>
                <p className="text-gray-300 mb-4 flex-grow">{position.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                    {position.level.level}
                  </span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {position.institution.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-auto">
                  <span>Elections: {position.electionCount}</span>
                  <span>Candidates: {position.candidateCount}</span>
                </div>
              </Link>
            ))
            
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className={`px-4 py-2 border rounded ${page === 0 ? 'border-gray-600 text-gray-500 cursor-not-allowed' : 'border-gray-400 text-white hover:bg-gray-700'}`}
          >
            Previous
          </button>
          <button
            disabled={positions.length < itemsPerPage}
            onClick={() => setPage(p => p + 1)}
            className={`px-4 py-2 border rounded ${positions.length < itemsPerPage ? 'border-gray-600 text-gray-500 cursor-not-allowed' : 'border-gray-400 text-white hover:bg-gray-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionsPage;
