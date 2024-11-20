import React from 'react';
import { Box, Typography } from '@mui/material';
import CitySelector from '../../components/CitySelector';
import AlertDisplay from '../../components/AlertDisplay';
import Header from '../../components/Header';


const Geofence = () => {
  return (
    <Box p={3}>
      <Header title="Geofencing Dashboard" subtitle="City Geofencing" />

      <Box mb={4}>
        <CitySelector />
      </Box>

      <Box mb={4}>
        <AlertDisplay />
      </Box>
    </Box>
  );
};

export default Geofence;
