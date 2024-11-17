import React from 'react';
import { Box, Typography } from '@mui/material';
import FuelLogForm from '../../components/FuelLogs';


const Form = () => {
  const vehicleId = 1; // Hardcoded for now; could be dynamic

  return (
    <Box p={3}> 
      <Typography variant="h4" mb={2} color="primary">
        Fuel Log Management
      </Typography>
      <Box mb={4}>
        <FuelLogForm />
      </Box>
    </Box>
  );
};

export default Form;
