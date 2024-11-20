import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { fetchFuelLogsById, fetchFuelLogs } from "../api/dataService"; 
import { tokens } from '../theme';

const OdometerDisplay = ({ selectedVehicle }) => {
  const [odometerReading, setOdometerReading] = useState(null);
  const [previousOdometer, setPreviousOdometer] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch the latest and previous odometer readings
  const getLatestOdometer = async () => {
    try {
      let data;
      if (selectedVehicle) {
        // Fetch data for the selected vehicle
        data = await fetchFuelLogsById(selectedVehicle);
      } else {
        // Fetch data for all vehicles
        data = await fetchFuelLogs();
      }

      if (selectedVehicle) {
        // Reverse the data array to get the latest reading first
        data.reverse();

        // Assuming data is sorted with the latest reading first
        if (data.length > 1) {
          setOdometerReading(data[0].odometer);
          setPreviousOdometer(data[1].odometer);
        } else if (data.length === 1) {
          setOdometerReading(data[0].odometer);
          setPreviousOdometer(null); // No previous reading available
        }
      } else {
        // Calculate total odometer readings when no vehicle is selected
        // Group by vehicleId and get the latest odometer for each vehicle
        const vehicleMap = {};
        data.forEach(log => {
          if (!vehicleMap[log.vehicleId] || new Date(log.timestamp) > new Date(vehicleMap[log.vehicleId].timestamp)) {
            vehicleMap[log.vehicleId] = log;
          }
        });
      
        // Sum the latest odometer readings for each vehicle
        const totalOdometer = Object.values(vehicleMap).reduce((total, log) => total + (log.odometer || 0), 0);
      
        setOdometerReading(totalOdometer);
        setPreviousOdometer(null); // No comparison for total odometer
      }
    } catch (error) {
      console.error('Error fetching odometer readings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestOdometer();
  }, [selectedVehicle]);

  // Calculate the percentage change
  const calculatePercentageChange = () => {
    if (odometerReading !== null && previousOdometer !== null) {
      return ((odometerReading - previousOdometer) / previousOdometer) * 100;
    }
    return null;
  };

  const percentageChange = calculatePercentageChange();

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
        Kilometers Traveled
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h4" color="#fffff">
            {odometerReading !== null
              ? `${odometerReading} km`
              : 'No data available'}
          </Typography>
          {selectedVehicle && percentageChange !== null && (
            <Typography variant="body1" color="secondary" mt={1}>
              {`Change: ${percentageChange.toFixed(2)}%`}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default OdometerDisplay;
