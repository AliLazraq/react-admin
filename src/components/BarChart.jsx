import { ResponsiveLine } from "@nivo/line";
import { Box, Typography, useTheme, Select, MenuItem } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { fetchVehicleFuelLogs } from "../api/dataService";

const DistanceTraveledChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // Color mapping for vehicle lines
  const lineColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]; // Add more colors if needed

  useEffect(() => {
    const loadChartData = async () => {
      const vehicleFuelLogs = await fetchVehicleFuelLogs();
      const distanceData = createDistanceTraveledData(vehicleFuelLogs);

      setChartData(distanceData);
      if (distanceData.length > 0) {
        setSelectedVehicle(distanceData[0].id); // Set the first vehicle as selected
      }
    };
    loadChartData();
  }, []);

  const createDistanceTraveledData = (fuelLogs) => {
    const groupedLogs = {};

    fuelLogs.forEach((log) => {
      const vehicleKey = `${log.make} (${log.plateNumber})`;
      if (!groupedLogs[vehicleKey]) {
        groupedLogs[vehicleKey] = [];
      }
      groupedLogs[vehicleKey].push(log);
    });

    const vehicleData = Object.entries(groupedLogs).map(([vehicleKey, logs]) => {
      const sortedLogs = logs.sort((a, b) => new Date(a.date) - new Date(b.date));

      const data = sortedLogs.map((log, index) => {
        if (index === 0) return { x: log.date.split("T")[0], y: 0 };
        const prevLog = sortedLogs[index - 1];
        const distance = log.odometer - prevLog.odometer;
        return { x: log.date.split("T")[0], y: distance > 0 ? distance : 0 };
      });

      return {
        id: vehicleKey,
        data,
      };
    });

    return vehicleData;
  };

  const visibleData = chartData.filter((data) => data.id === selectedVehicle);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      {/* Vehicle Dropdown on Top */}
      <Box
        sx={{
          marginTop: "7px",
          marginBottom: "-9px",
          display: "flex",
          alignSelf: "flex-start", // Align dropdown to the left
        }}
      >
        <Select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          displayEmpty
          sx={{
            color: colors.grey[100],
            borderRadius: "5px",
            fontSize: "0.8rem",
            "& .MuiSelect-icon": {
              color: colors.grey[100],
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.grey[300],
            },
          }}
        >
          {chartData.map((vehicle, index) => (
            <MenuItem
              key={vehicle.id}
              value={vehicle.id}
              sx={{
                color: lineColors[index % lineColors.length],
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {vehicle.id}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Line Chart */}
      <Box style={{ height: "240px", width: "100%" }}>
        {visibleData.length > 0 ? (
          <ResponsiveLine
            data={visibleData}
            margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
            }}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "",
              legendOffset: 40,
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
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: colors.grey[100],
                  },
                },
                legend: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
                ticks: {
                  line: {
                    stroke: colors.grey[100],
                  },
                  text: {
                    fill: colors.grey[100],
                  },
                },
              },
              grid: {
                line: {
                  stroke: colors.grey[300],
                  strokeWidth: 1,
                },
              },
              tooltip: {
                container: {
                  color: colors.primary[500],
                },
              },
            }}
            colors={(d) =>
              lineColors[chartData.findIndex((v) => v.id === d.id) % lineColors.length]
            }
            pointSize={10}
            pointColor={colors.grey[900]}
            pointBorderWidth={2}
            pointBorderColor={colors.primary[100]}
            enableGridX={false}
            enableGridY={true}
            useMesh={true}
            legends={[]}
          />
        ) : (
          <Typography variant="h6" color="error" align="center">
            No data available for the selected vehicle.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DistanceTraveledChart;
