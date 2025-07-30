import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StudyDetail: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Study Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Study detail page - Coming soon</Typography>
      </Paper>
    </Box>
  );
};

export default StudyDetail;
