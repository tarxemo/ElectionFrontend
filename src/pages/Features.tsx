// src/pages/Features.tsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Line
} from 'recharts';
import Navbar from '../components/Navbar';
import {
  HowToVote,
  Analytics,
  Groups,
  Timeline,
  Gavel,
  TaskAlt,
  DataObject,
  Api,
  Storage
} from '@mui/icons-material';

const FeaturesPage: React.FC = () => {
  const theme = useTheme();
  
  // Chart color scheme
  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    '#FFE31A',
    '#10B981',
    '#3B82F6',
    '#EC4899'
  ];

  // Hardcoded data
  const systemFeatures = [
    {
      title: "Multi-Level Elections",
      description: "Support for university, college, and hostel level elections with appropriate hierarchies.",
      icon: <HowToVote fontSize="large" />
    },
    {
      title: "Real-Time Analytics",
      description: "Live tracking of voting patterns and trends with comprehensive dashboards.",
      icon: <Analytics fontSize="large" />
    },
    {
      title: "Candidate Management",
      description: "Complete workflow for candidate nomination, approval, and campaign management.",
      icon: <Groups fontSize="large" />
    },
    {
      title: "Historical Trends",
      description: "View election results and participation rates over multiple academic years.",
      icon: <Timeline fontSize="large" />
    },
    {
      title: "Result Certification",
      description: "Secure, tamper-proof election results with audit trails.",
      icon: <Gavel fontSize="large" />
    },
    {
      title: "Promise Tracking",
      description: "Monitor leader performance against campaign promises post-election.",
      icon: <TaskAlt fontSize="large" />
    }
  ];

  const electionStats = [
    { level: 'University', positions: 12, active: 8, candidates: 45 },
    { level: 'College', positions: 24, active: 18, candidates: 92 },
    { level: 'Hostel', positions: 36, active: 30, candidates: 128 }
  ];

  const votingActivity = [
    { day: 'Mon', votes: 3200 },
    { day: 'Tue', votes: 4200 },
    { day: 'Wed', votes: 5100 },
    { day: 'Thu', votes: 3800 },
    { day: 'Fri', votes: 2900 },
    { day: 'Sat', votes: 1800 },
    { day: 'Sun', votes: 1200 }
  ];

  const leaderPerformance = [
    { subject: 'Leadership', score: 85 },
    { subject: 'Transparency', score: 78 },
    { subject: 'Communication', score: 92 },
    { subject: 'Initiative', score: 80 },
    { subject: 'Accountability', score: 88 }
  ];

  const techStack = [
    { name: 'React', category: 'Frontend', icon: <DataObject /> },
    { name: 'Material-UI', category: 'Frontend', icon: <DataObject /> },
    { name: 'Apollo Client', category: 'Frontend', icon: <Api /> },
    { name: 'Django', category: 'Backend', icon: <Storage /> },
    { name: 'GraphQL', category: 'Backend', icon: <Api /> },
    { name: 'PostgreSQL', category: 'Backend', icon: <Storage /> }
  ];

  return (
    <Box sx={{ 
      backgroundColor: 'bg-gray-900 ',
      minHeight: '100vh',
      color: 'text.primary'
    }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },
        textAlign: 'center',
        background: 'bg-gray-900 '
      }}>
        <Typography variant="h2" component="h1" sx={{
          fontWeight: 700,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Voting System Features
        </Typography>
        <Typography variant="h5" sx={{
          maxWidth: '800px',
          mx: 'auto',
          color: 'text.secondary',
          lineHeight: 1.6
        }}>
          Comprehensive digital voting platform designed specifically for the University of Dodoma's multi-level election needs
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{
        maxWidth: '1800px',
        mx: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        pb: 10
      }}>
        {/* Features Grid */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'bg-gray-700 ',
              mx: 'auto',
              mt: 2
            }
          }}>
            Core Features
          </Typography>
          
          <Grid container spacing={4}>
            {systemFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.2)`
                  }
                }}>
                  <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4
                  }}>
                    <Box sx={{
                      mb: 3,
                      color: CHART_COLORS[index % CHART_COLORS.length],
                      fontSize: '2.5rem'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" sx={{ 
                      fontWeight: 600,
                      mb: 2
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'text.secondary',
                      flexGrow: 1
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Data Visualization Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              mx: 'auto',
              mt: 2
            }
          }}>
            Election Insights
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Positions by Level
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={electionStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="level" 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="positions" 
                      name="Total Positions" 
                      fill={CHART_COLORS[0]} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="active" 
                      name="Active Elections" 
                      fill={CHART_COLORS[1]} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="candidates" 
                      name="Total Candidates" 
                      fill={CHART_COLORS[2]} 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Weekly Voting Activity
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={votingActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="votes" 
                      name="Votes Cast" 
                      stroke={CHART_COLORS[3]} 
                      fill={CHART_COLORS[3]} 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                    Voting Trend Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={{ stroke: theme.palette.divider }}
                    />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="votes" 
                        stroke="#FFE31A" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </Card>
        </Grid>
        </Grid> */}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Leader Performance Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={leaderPerformance}>
                    <PolarGrid stroke={theme.palette.divider} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: theme.palette.text.secondary }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      tick={{ fill: theme.palette.text.secondary }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke={CHART_COLORS[4]} 
                      fill={CHART_COLORS[4]} 
                      fillOpacity={0.4} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Election Position Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={electionStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="positions"
                      nameKey="level"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {electionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              mx: 'auto',
              mt: 2
            }
          }}>
            Technology Stack
          </Typography>

          <Grid container spacing={4}>
            {techStack.map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 20px -5px rgba(0, 0, 0, 0.2)`
                  }
                }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60,
                    mb: 2,
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    color: theme.palette.getContrastText(CHART_COLORS[index % CHART_COLORS.length]),
                    fontSize: '1.75rem'
                  }}>
                    {tech.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {tech.name}
                  </Typography>
                  <Chip 
                    label={tech.category} 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      backgroundColor: theme.palette.action.selected,
                      color: 'text.secondary'
                    }} 
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesPage;