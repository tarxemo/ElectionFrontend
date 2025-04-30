import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GET_INSTITUTION_DETAILS,
  GET_COLLEGE_DISTRIBUTION,
  GET_ELECTION_TRENDS,
  GET_INSTITUTIONS_BY_LEVEL,
  GET_ACADEMIC_YEARS,
  GET_ELECTION_CONTESTANTS
} from '../api/queries';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme
} from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

// Define your color palette based on project colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const InstitutionDetailsPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [filters, setFilters] = useState({
      election: '',
      position: '',
      academicYear: '',
      search: ''
    });
  const theme = useTheme();
  const [institution, setInstitution] = useState<any>(null);
  
  // Fetch data
  const { loading: detailsLoading, data: detailsData } = useQuery(GET_INSTITUTION_DETAILS, {
    variables: { institutionId },
  });
  
  const { loading: distributionLoading, data: distributionData } = useQuery(GET_COLLEGE_DISTRIBUTION, {
    variables: { parentInstitutionId: institution?.level === 'UNIVERSITY' ? null : institutionId },
    skip: !institution
  });
  
  const { loading: trendsLoading, data: trendsData } = useQuery(GET_ELECTION_TRENDS, {
    variables: { institutionId },
  });

  // Mock data for demonstration - replace with real data from API
  const statsCards = [
    { title: 'Total Students', value: detailsData?.institutionDetails?.totalStudents || 0, color: '#4e73df' },
    { title: 'Active Elections', value: detailsData?.institutionDetails?.activeElections || 0, color: '#1cc88a' },
    { title: 'Votes Cast', value: detailsData?.institutionDetails?.totalVotesCast || 0, color: '#36b9cc' },
    { title: 'Voter Turnout', value: `${detailsData?.institutionDetails?.voterTurnout?.toFixed(1) || 0}%`, color: '#f6c23e' },
    { title: 'Positions', value: detailsData?.institutionDetails?.positionsAvailable || 0, color: '#e74a3b' },
    { title: 'Current Leaders', value: detailsData?.institutionDetails?.currentLeaders || 0, color: '#5a5c69' },
  ];

  if (detailsLoading || distributionLoading || trendsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  

  const { data: institutionData } = useQuery(GET_INSTITUTION_DETAILS, {
    variables: { institutionId },
  });
  
  // Fetch filter options
  const { data: electionsData } = useQuery(GET_INSTITUTIONS_BY_LEVEL, {
    variables: { level: 'ELECTION' },
  });
  
  const { data: positionsData } = useQuery(GET_INSTITUTIONS_BY_LEVEL, {
    variables: { level: 'POSITION' },
  });
  
  const { data: academicYearsData } = useQuery(GET_ACADEMIC_YEARS);
  
  // Fetch contestants with filters
  const { data: contestantsData } = useQuery(GET_ELECTION_CONTESTANTS, {
    variables: { 
      institutionId,
      electionId: filters.election || null,
      positionId: filters.position || null,
      academicYearId: filters.academicYear || null
    },
  });
  
  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {institution?.name || 'Institution Details'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive statistics and analytics for this institution
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Filter Contestants
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Election</InputLabel>
              <Select
                value={filters.election}
                onChange={(e) => handleFilterChange('election', e.target.value)}
                label="Election"
              >
                <MenuItem value="">All Elections</MenuItem>
                {electionsData?.institutionsByLevel?.map((election: any) => (
                  <MenuItem key={election.id} value={election.id}>
                    {election.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Position</InputLabel>
              <Select
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                label="Position"
              >
                <MenuItem value="">All Positions</MenuItem>
                {positionsData?.institutionsByLevel?.map((position: any) => (
                  <MenuItem key={position.id} value={position.id}>
                    {position.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={filters.academicYear}
                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                label="Academic Year"
              >
                <MenuItem value="">All Years</MenuItem>
                {academicYearsData?.academicYears?.map((year: any) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search Contestants"
              variant="outlined"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
        </Grid>
      </Card>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%', borderLeft: `4px solid ${card.color}` }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* College Distribution Pie Chart */}
        {distributionData?.collegeDistribution && (
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Student Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={distributionData.collegeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.collegeDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        )}
        
        {/* Election Trends Bar Chart */}
        {trendsData?.electionTrends && (
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Election Trends Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={trendsData.electionTrends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="voters" name="Voters" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="turnout" name="Turnout %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        )}
        
        {/* Additional charts can be added here */}
      </Grid>
      
      {/* Additional Sections */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Elections
          </Typography>
          {/* Add election table or list here */}
        </Card>
      </Box>
    </Box>
  );
};
export default InstitutionDetailsPage;