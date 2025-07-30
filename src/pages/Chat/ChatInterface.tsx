import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChatInterface: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Chat Interface
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Contextual Q&A Chat - Coming soon</Typography>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
