import React from 'react';
import { Box, Typography } from '@mui/material';
import FuelLogForm from '../../components/FuelLogs';
import Header from '../../components/Header';


const Form = () => {
 

  return (
    <Box p={3}> 
      <Header title="Fuel Log Management" subtitle="Add Fuel Log" />
      <Box mb={4}>
        <FuelLogForm />
      </Box>
    </Box>
  );
};

export default Form;
