import React from 'react';
import { Box, Typography } from '@mui/material';
import CitySelector from '../../components/CitySelector';
import AlertDisplay from '../../components/AlertDisplay';

const Geofence = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Geofencing Dashboard
      </Typography>

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
