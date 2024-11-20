import React from 'react';
import { Box, Typography } from '@mui/material';
import FuelLogForm from '../../components/MaintenanceAlerts';
import Header from '../../components/Header';
import MaintenanceAlerts from '../../components/MaintenanceAlerts';


const Form = () => {
 

  return (
    <Box p={3}> 
      <Header title="Maintenance" subtitle="Test" />
      <Box mb={4}>
        <MaintenanceAlerts />
      </Box>
    </Box>
  );
};

export default Form;
