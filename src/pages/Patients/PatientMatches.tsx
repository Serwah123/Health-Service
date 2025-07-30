import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PatientMatches: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Matches
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Patient matching interface - Coming soon</Typography>
      </Paper>
    </Box>
  );
};

export default PatientMatches;
