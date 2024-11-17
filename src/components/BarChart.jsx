// import { useTheme } from "@mui/material";
// import { ResponsiveBar } from "@nivo/bar";
// import { tokens } from "../theme";
// import { useEffect, useState } from "react";
// import { fetchFuelLogs, fetchVehicleById } from "../api/dataService";

// const BarChart = ({ isDashboard = false }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [barData, setBarData] = useState([]);

//   useEffect(() => {
//     const loadBarData = async () => {
//       try {
//         const fuelLogs = await fetchFuelLogs();

//         // Group fuel logs by vehicleId and find the last odometer for each vehicle
//         const groupedLogs = fuelLogs.reduce((acc, log) => {
//           if (!acc[log.vehicleId] || new Date(acc[log.vehicleId].date) < new Date(log.date)) {
//             acc[log.vehicleId] = log;
//           }
//           return acc;
//         }, {});

//         const vehicleData = await Promise.all(
//           Object.keys(groupedLogs).map(async (vehicleId) => {
//             const vehicleDetails = await fetchVehicleById(vehicleId);
//             return {
//               vehicle: `${vehicleDetails.make} ${vehicleDetails.model}`,
//               odometer: groupedLogs[vehicleId].odometer,
//             };
//           })
//         );

//         setBarData(vehicleData);
//       } catch (error) {
//         console.error("Error loading bar chart data:", error);
//       }
//     };

//     loadBarData();
//   }, []);

//   return (
//     <ResponsiveBar
//       data={barData}
//       keys={["odometer"]}
//       indexBy="vehicle"
//       theme={{
//         axis: {
//           domain: { line: { stroke: colors.grey[100] } },
//           legend: { text: { fill: colors.grey[100] } },
//           ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } },
//         },
//         legends: { text: { fill: colors.grey[100] } },
//       }}
//       margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//       padding={0.3}
//       valueScale={{ type: "linear" }}
//       indexScale={{ type: "band", round: true }}
//       colors={{ scheme: "nivo" }}
//       borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: -30,
//         legend: isDashboard ? undefined : "Vehicle",
//         legendPosition: "middle",
//         legendOffset: 32,
//       }}
//       axisLeft={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: "Odometer",
//         legendPosition: "middle",
//         legendOffset: -40,
//       }}
//       enableLabel={true}
//       labelSkipWidth={12}
//       labelSkipHeight={12}
//       labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//       legends={[
//         {
//           dataFrom: "keys",
//           anchor: "bottom-right",
//           direction: "column",
//           justify: false,
//           translateX: 120,
//           translateY: 0,
//           itemsSpacing: 2,
//           itemWidth: 100,
//           itemHeight: 20,
//           itemDirection: "left-to-right",
//           itemOpacity: 0.85,
//           symbolSize: 20,
//           effects: [{ on: "hover", style: { itemOpacity: 1 } }],
//         },
//       ]}
//       role="application"
//       barAriaLabel={(e) => `${e.id}: ${e.formattedValue} for vehicle: ${e.indexValue}`}
//     />
//   );
// };

// export default BarChart;


import {
  useTheme,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { fetchFuelLogs } from "../api/dataService";

const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      const fuelLogs = await fetchFuelLogs();
      const distanceData = createDistanceTraveledData(fuelLogs);
      setChartData(distanceData);
    };
    loadChartData();
  }, []);

  const createDistanceTraveledData = (fuelLogs) => {
    const vehicles = [1, 2];
    const vehicleData = vehicles.map((vehicleId) => {
      const filteredLogs = fuelLogs
        .filter((log) => log.vehicleId === vehicleId)
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort logs by date

      const data = filteredLogs.map((log, index) => {
        if (index === 0) return { x: log.date.split("T")[0], y: 0 }; // No distance for the first log
        const prevLog = filteredLogs[index - 1];
        const distance = log.odometer - prevLog.odometer;
        return { x: log.date.split("T")[0], y: distance > 0 ? distance : 0 }; // Only include positive distances
      });

      return {
        id: `Vehicle ${vehicleId}`,
        data,
      };
    });

    return vehicleData;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        marginTop: "-20px",
        width: "100%",
        padding: "0px",
        borderRadius: "10px",
        backgroundColor: colors.primary[400],
      }}
    >
      {/* Line Chart */}
      <Box style={{ height: "270px", width: "100%" }}>
        {chartData.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0, // Start from 0
              max: "auto",
              stacked: false,
            }}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Date",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Distance Traveled (km)",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={colors.grey[900]}
            pointBorderWidth={2}
            pointBorderColor={colors.primary[100]}
            enableGridX={false}
            enableGridY={true}
            useMesh={true}
            colors={{ scheme: "set1" }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 80,
                itemWidth: 80,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        ) : (
          <Typography variant="h6" color="error" align="center">
            No data available for the selected vehicles.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BarChart;
