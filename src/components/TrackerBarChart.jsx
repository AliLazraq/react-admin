import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { fetchTrackersByVehicleId } from "../api/dataService"; 

const TrackerBarChart = ({ selectedVehicle }) => {
  const [trackerData, setTrackerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVehicle) return;

      setLoading(true);
      try {
        const data = await fetchTrackersByVehicleId(selectedVehicle);
        const chartData = data.map((item) => ({
          operation: item.operationType,
          value: item.value,
          alert: item.value < 0, // True if overdue
        }));
        setTrackerData(chartData);
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
        <Typography variant="h6">Please select a vehicle to view tracker details.</Typography>
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
        <Typography variant="body1">No tracker data available for this vehicle.</Typography>
      </Box>
    );
  }

  // Set a consistent maximum range for the x-axis
  const maxRange = Math.max(...trackerData.map((d) => Math.abs(d.value))) + 5000;

  return (
    <Box sx={{ height: "400px", padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Maintenance Tracker for Vehicle {selectedVehicle}
      </Typography>
      <ResponsiveBar
        data={trackerData}
        keys={["value"]}
        indexBy="operation"
        layout="horizontal"
        margin={{ top: 20, right: 130, bottom: 50, left: 150 }}
        padding={0.3}
        valueScale={{ type: "linear", min: -maxRange, max: maxRange }} // Ensure uniform x-axis
        colors={({ data }) => (data.alert ? "#f47560" : "#61cdbb")} // Red for overdue, green for remaining
        label={(d) => `${d.value > 0 ? "Remaining: " : "Overdue by: "} ${Math.abs(d.value)}`}
        labelTextColor="#000"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Distance",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Operation Type",
          legendPosition: "middle",
          legendOffset: -100,
        }}
        tooltip={({ value }) => (
          <strong>{`${value > 0 ? "Remaining: " : "Overdue by: "} ${Math.abs(value)}`}</strong>
        )}
      />
    </Box>
  );
};

export default TrackerBarChart;
