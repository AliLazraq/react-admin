import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { fetchTrackersByVehicleId } from "../api/dataService"; // Ensure the correct path
import SingleBarChart from "./SingleBarChart";

const TrackerBarCharts = ({ selectedVehicle }) => {
  const [trackerData, setTrackerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define max ranges for each operation type
  const operationMaxRanges = {
    "Oil Change": 10000,
    "Tires Change": 50000,
    "Distribution Chain Change": 150000,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVehicle) return;

      setLoading(true);
      try {
        const data = await fetchTrackersByVehicleId(selectedVehicle);
        setTrackerData(data);
      } catch (error) {
        console.error("Error fetching tracker data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedVehicle]);

  if (!selectedVehicle) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h6">
          Please select a vehicle to view tracker details.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (trackerData.length === 0) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Typography variant="body1">
          No tracker data available for this vehicle.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {trackerData.map((item) => (
        <SingleBarChart
          key={item.operationType}
          operationType={item.operationType}
          value={item.value}
          maxRange={operationMaxRanges[item.operationType] || 10000} // Default to 10000 if not defined
        />
      ))}
    </Box>
  );
};

export default TrackerBarCharts;
