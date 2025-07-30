import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Science as ScienceIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { StudyStats, Study } from '@/types';

// Mock data for demonstration
const mockStats: StudyStats = {
  totalStudies: 12,
  activeStudies: 8,
  totalEnrollment: 245,
  averageEnrollmentRate: 67.5,
  recentActivity: [
    {
      id: '1',
      type: 'study_created',
      description: 'New study "COVID-19 Vaccine Efficacy" was created',
      timestamp: '2025-01-28T10:30:00Z',
      userId: 'user1',
      studyId: 'study1',
    },
    {
      id: '2',
      type: 'patient_enrolled',
      description: 'Patient enrolled in "Diabetes Management Study"',
      timestamp: '2025-01-28T09:15:00Z',
      userId: 'user2',
      studyId: 'study2',
    },
    {
      id: '3',
      type: 'form_submitted',
      description: 'Data form submitted for patient P001',
      timestamp: '2025-01-28T08:45:00Z',
      userId: 'user3',
      studyId: 'study3',
    },
  ],
};

const mockRecentStudies: Study[] = [
  {
    id: '1',
    title: 'COVID-19 Vaccine Efficacy Study',
    description: 'A randomized controlled trial to assess vaccine effectiveness',
    objectives: ['Measure vaccine efficacy', 'Monitor side effects'],
    criteria: {
      inclusionCriteria: ['Age 18-65', 'Healthy individuals'],
      exclusionCriteria: ['Pregnancy', 'Immunocompromised'],
      ageRange: { min: 18, max: 65 },
      gender: 'any',
      conditions: [],
    },
    status: 'active',
    createdBy: 'Dr. Smith',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z',
    enrollmentCount: 45,
    targetEnrollment: 100,
  },
  {
    id: '2',
    title: 'Diabetes Management Study',
    description: 'Evaluating new glucose monitoring techniques',
    objectives: ['Compare monitoring methods', 'Assess patient satisfaction'],
    criteria: {
      inclusionCriteria: ['Type 2 diabetes', 'Age 40+'],
      exclusionCriteria: ['Type 1 diabetes'],
      ageRange: { min: 40, max: 80 },
      gender: 'any',
      conditions: ['Type 2 Diabetes'],
    },
    status: 'active',
    createdBy: 'Dr. Johnson',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-27T00:00:00Z',
    enrollmentCount: 32,
    targetEnrollment: 50,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats] = useState<StudyStats>(mockStats);
  const [recentStudies] = useState<Study[]>(mockRecentStudies);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactElement;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'info';
      case 'paused':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/studies/create')}
          size="large"
        >
          Create New Study
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Studies"
            value={stats.totalStudies}
            icon={<ScienceIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Studies"
            value={stats.activeStudies}
            icon={<TrendingUpIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Enrollment"
            value={stats.totalEnrollment}
            icon={<PeopleIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Enrollment Rate"
            value={`${stats.averageEnrollmentRate}%`}
            icon={<AssignmentIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Studies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Studies
              </Typography>
              <Button size="small" onClick={() => navigate('/studies')}>
                View All
              </Button>
            </Box>
            <List>
              {recentStudies.map((study) => (
                <ListItem
                  key={study.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    cursor: 'pointer',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                  onClick={() => navigate(`/studies/${study.id}`)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Typography variant="subtitle1" component="div">
                      {study.title}
                    </Typography>
                    <Chip
                      label={study.status}
                      color={getStatusColor(study.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {study.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption">
                      Enrollment: {study.enrollmentCount}/{study.targetEnrollment}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(study.enrollmentCount / study.targetEnrollment) * 100}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List>
              {stats.recentActivity.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.description}
                    secondary={formatDate(activity.timestamp)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
