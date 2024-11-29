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

  const emptyData = Object.keys(operationMaxRanges).map((operation) => ({
    operationType: operation,
    value: 0,
    maxRange: operationMaxRanges[operation],
  }));

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVehicle) {
        setTrackerData(emptyData); // Use empty progress bars
        setLoading(false);
        return;
      }

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
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
          maxRange={item.maxRange || operationMaxRanges[item.operationType]} // Default to operationMaxRanges if maxRange is undefined
        />
      ))}
    </Box>
  );
};

export default TrackerBarCharts;
