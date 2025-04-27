// pages/PositionsPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_POSITIONS,
  GET_POSITION_STATS,
  GET_INSTITUTIONS_BY_LEVEL,
  GET_ACADEMIC_YEARS
} from '../api/queries';
import { PositionStatsChart } from '../components/charts/PositionStatsChart';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Navbar from '../components/Navbar';

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
  parent?: {
    id: string;
    name: string;
  };
}

const PositionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    institutionId: '',
    academicYearId: '',
    hasElections: false as boolean ,
    hasCandidates: false as boolean 
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [academicYears, setAcademicYears] = useState<Array<{id: string, name: string}>>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch positions
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSITIONS, {
    variables: {
      filters: {
        search: searchTerm,
        ...filters
      },
      first: itemsPerPage,
      skip: page * itemsPerPage
    }
  });

  // Fetch stats for charts
  const { data: statsData } = useQuery(GET_POSITION_STATS);

  // Fetch institutions when level changes
  useEffect(() => {
    if (filters.level) {
      // In a real app, you would use GET_INSTITUTIONS_BY_LEVEL query here
      // This is simplified for the example
      setInstitutions([
        { id: '1', name: 'College of Education' },
        { id: '2', name: 'College of Science' }
      ]);
    } else {
      setInstitutions([]);
    }
    setFilters(prev => ({ ...prev, institutionId: '' }));
  }, [filters.level]);

  // Fetch academic years
  useEffect(() => {
    // In a real app, you would use GET_ACADEMIC_YEARS query here
    setAcademicYears([
      { id: '1', name: '2022-2023' },
      { id: '2', name: '2023-2024' }
    ]);
  }, []);

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
      hasCandidates: false
    });
  };

  const positions = data?.allPositions || [];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Container maxWidth="xl" className="py-8">
        {/* Page Header */}
        <Box mb={4} className="flex justify-between items-center">
          <Typography variant="h4" className="text-[#FFE31A] font-bold">
            Election Positions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {/* Search and Filters */}
        <Paper className="p-4 mb-6 bg-gray-800">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                  className: "bg-gray-700 text-white rounded"
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="bg-[#FFE31A] text-gray-900 hover:bg-[#FFD700]"
              >
                Search
              </Button>
            </div>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <FormControl fullWidth variant="outlined" className="bg-gray-700 rounded">
                <InputLabel className="text-white">Level</InputLabel>
                <Select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  label="Level"
                  className="text-white"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="UNIVERSITY">University</MenuItem>
                  <MenuItem value="COLLEGE">College</MenuItem>
                  <MenuItem value="HOSTEL">Hostel</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" className="bg-gray-700 rounded" disabled={!filters.level}>
                <InputLabel className="text-white">Institution</InputLabel>
                <Select
                  value={filters.institutionId}
                  onChange={(e) => handleFilterChange('institutionId', e.target.value)}
                  label="Institution"
                  className="text-white"
                >
                  <MenuItem value="">All Institutions</MenuItem>
                  {institutions.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" className="bg-gray-700 rounded">
                <InputLabel className="text-white">Academic Year</InputLabel>
                <Select
                  value={filters.academicYearId}
                  onChange={(e) => handleFilterChange('academicYearId', e.target.value)}
                  label="Academic Year"
                  className="text-white"
                >
                  <MenuItem value="">All Years</MenuItem>
                  {academicYears.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="flex items-center gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => refetch()}
                  className="bg-[#FFE31A] text-gray-900 hover:bg-[#FFD700]"
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearFilters}
                  className="text-white"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </Paper>

        {/* Stats Charts */}
        {statsData?.positionStats && (
          <Paper className="p-4 mb-6 bg-gray-800">
            <Typography variant="h6" className="text-[#FFE31A] mb-4">
              Position Statistics
            </Typography>
            <PositionStatsChart data={statsData.positionStats} />
          </Paper>
        )}

        {/* Positions List */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} className="flex justify-center">
              <CircularProgress className="text-[#FFE31A]" />
            </Grid>
          ) : error ? (
            <Grid item xs={12}>
              <Typography color="error">Error loading positions: {error.message}</Typography>
            </Grid>
          ) : positions.length === 0 ? (
            <Grid item xs={12}>
              <Typography className="text-white">No positions found matching your criteria</Typography>
            </Grid>
          ) : (
            positions.map((position: Position) => (
              <Grid item xs={12} sm={6} md={4} key={position.id}>
                <Card className="h-full bg-gray-800 text-white">
                  <CardContent>
                    <Typography variant="h6" className="text-[#FFE31A]">
                      {position.name}
                    </Typography>
                    <Typography variant="body2" className="my-2 text-gray-300">
                      {position.description || 'No description available'}
                    </Typography>
                    <div className="flex flex-wrap gap-2 my-2">
                      <Chip
                        label={position.level.level}
                        size="small"
                        className="bg-[#FFE31A] text-gray-900"
                      />
                      <Chip
                        label={position.institution.name}
                        size="small"
                        className="bg-blue-500 text-white"
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Typography variant="caption" className="text-gray-400">
                        Elections: {position.electionCount}
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        Candidates: {position.candidateCount}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        <Box mt={4} className="flex justify-center">
          <Button
            variant="outlined"
            color="primary"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="mr-2 text-white"
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={positions.length < itemsPerPage}
            onClick={() => setPage(p => p + 1)}
            className="text-white"
          >
            Next
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default PositionsPage;