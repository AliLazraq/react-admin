import { ResponsiveLine } from "@nivo/line";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  useTheme,
  Typography,
} from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { fetchVehicleFuelLogs } from "../api/dataService";

const DistanceTraveledChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  const [visibleVehicles, setVisibleVehicles] = useState({});

  // Color mapping for vehicle lines
  const lineColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]; // Add more colors if needed

  useEffect(() => {
    const loadChartData = async () => {
      const vehicleFuelLogs = await fetchVehicleFuelLogs();
      const distanceData = createDistanceTraveledData(vehicleFuelLogs);

      const initialVisibility = {};
      distanceData.forEach(({ id }) => {
        initialVisibility[id] = true; // Default: Show all vehicles
      });

      setVisibleVehicles(initialVisibility);
      setChartData(distanceData);
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

  const visibleData = chartData.filter((data) => visibleVehicles[data.id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      {/* Vehicle Toggles */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{ color: colors.grey[100], marginBottom: "10px" }}
        >
          Vehicles
        </Typography>
        <FormGroup>
          {Object.keys(visibleVehicles).map((vehicle, index) => (
            <FormControlLabel
              key={vehicle}
              control={
                <Checkbox
                  checked={visibleVehicles[vehicle]}
                  onChange={(e) =>
                    setVisibleVehicles({
                      ...visibleVehicles,
                      [vehicle]: e.target.checked,
                    })
                  }
                  sx={{
                    color: visibleVehicles[vehicle]
                      ? lineColors[index % lineColors.length]
                      : colors.grey[400],
                    "&.Mui-checked": { color: lineColors[index % lineColors.length] },
                  }}
                />
              }
              label={
                <Typography sx={{ color: colors.grey[100] }}>{vehicle}</Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      {/* Line Chart */}
      <Box style={{ height: "280px", width: "90%" }}>
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
            colors={(d) => lineColors[chartData.findIndex((v) => v.id === d.id) % lineColors.length]}
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
            No data available for the selected vehicles.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DistanceTraveledChart;
