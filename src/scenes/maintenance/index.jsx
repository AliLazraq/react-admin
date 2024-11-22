import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../../components/Header';
import MaintenanceAlerts from '../../components/MaintenanceAlerts';


const Maintenance = () => {
 

  return (
    <Box p={3}> 
      <Header title="Maintenance Alerts" subtitle="Information" />
      <Box mb={4}>
        <MaintenanceAlerts />
      </Box>
    </Box>
  );
};

export default Maintenance;
