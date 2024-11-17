import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { fetchVehicleById } from "../api/dataService";
import { tokens } from '../theme';

const CarModel = ({ selectedVehicle }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch vehicle details for the selected ID
  const getVehicleDetails = async () => {
    try {
      if (selectedVehicle) {
        const data = await fetchVehicleById(selectedVehicle);
        setVehicle(data);
      } else {
        setVehicle(null);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicleDetails();
  }, [selectedVehicle]); // Re-fetch when the selected vehicle changes

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      backgroundColor={colors.primary[400]}
      padding="20px"
      borderRadius="8px"
      height="100%"
    >
      <Typography variant="h6" gutterBottom color={colors.greenAccent[500]}>
        Model
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : vehicle ? (
        <Typography variant="h4" color={colors.grey[100]}>
          {vehicle.make} {vehicle.model}
          <Typography variant="h6" color={colors.greenAccent[500]}>
            {vehicle.year}
          </Typography>
        </Typography>
      ) : (
        <Typography variant="h6" color={colors.redAccent[400]}>
          No vehicle selected
        </Typography>
      )}
    </Box>
  );
};

export default CarModel;
