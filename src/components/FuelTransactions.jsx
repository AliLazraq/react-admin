import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { fetchFuelLogsById, fetchFuelLogs } from "../api/dataService";
import { tokens } from "../theme";

const FuelTransactions = ({ selectedVehicle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  // Fetch all fuel logs, either by vehicleId or all if no vehicle is selected
  const getFuelLogs = async () => {
    try {
      let data;

      if (selectedVehicle) {
        // Fetch logs for the selected vehicle
        data = await fetchFuelLogsById(selectedVehicle);
        console.log(`Fetching logs for vehicleId: ${selectedVehicle}`);
      } else {
        // Fetch all logs if no vehicle is selected
        data = await fetchFuelLogs();
        console.log("Fetching all logs");
      }

      // Reverse the data array to show the latest transactions first
      const reversedData = data.reverse();

      // Extract the relevant fields and take only the last 5 transactions
      const logEntries = reversedData.slice(0, 5).map((log) => ({
        fuelAmount: log.fuelAmount,
        fuelCost: log.fuelCost,
        date: log.date,
        location: log.location,
      }));

      setLogs(logEntries); // Save the last 5 logs to state
    } catch (error) {
      console.error("Error fetching fuel logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFuelLogs();
  }, [selectedVehicle]);

  return (
    <Box
      gridColumn="span 4"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      overflow="auto"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        color={colors.grey[100]}
        p="15px"
      >
        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
          {selectedVehicle ? `Transactions for the Vehicle` : "Fuel Transactions"}
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p="20px">
          <CircularProgress />
        </Box>
      ) : logs.length > 0 ? (
        logs.map((log, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h7"
                fontWeight="600"
              >
                Fuel Amount: {log.fuelAmount} L
              </Typography>
              <Typography color={colors.grey[100]}>
                Location: {log.location}
              </Typography>
            </Box>
            <Box color={colors.grey[100]}>
              {new Date(log.date).toLocaleDateString()}
            </Box>
            <Box
              backgroundColor={colors.greenAccent[500]}
              p="5px 10px"
              borderRadius="4px"
            >
              {log.fuelCost} MAD
            </Box>
          </Box>
        ))
      ) : (
        <Typography color={colors.grey[100]} textAlign="center" p="20px">
          No transactions available.
        </Typography>
      )}
    </Box>
  );
};

export default FuelTransactions;
