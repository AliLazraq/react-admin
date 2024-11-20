import {
  useTheme,
  Box,
  Typography,
  ButtonGroup,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { fetchVehicleFuelLogs } from "../api/dataService"; // Fetch the joined table

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState("fuel_amount"); // Toggle between `fuel_amount` and `fuel_cost`
  const [visibleVehicles, setVisibleVehicles] = useState({}); // Tracks visibility per vehicle

  // Define the bar colors
  const barColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"];

  useEffect(() => {
    const loadChartData = async () => {
      const vehicleFuelLogs = await fetchVehicleFuelLogs();
      const filteredDates = getFilteredDates(vehicleFuelLogs);
      const groupedData = createChartData(vehicleFuelLogs, filteredDates, viewMode);

      // Initialize visibility
      const initialVisibility = {};
      groupedData.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== "date") {
            initialVisibility[key] = true;
          }
        });
      });

      setVisibleVehicles(initialVisibility);
      setChartData(groupedData);
    };
    loadChartData();
  }, [viewMode]);

  const getFilteredDates = (fuelLogs) => {
    // Extract unique dates with fuel logs
    const dates = fuelLogs.map((log) => log.date.split("T")[0]);
    return [...new Set(dates)].sort();
  };

  const createChartData = (fuelLogs, filteredDates, mode) => {
    const groupedData = filteredDates.map((date) => {
      const entry = { date };

      fuelLogs.forEach((log) => {
        const vehicleLabel = `${log.make} (${log.plateNumber})`;
        if (!entry[vehicleLabel]) entry[vehicleLabel] = 0;

        if (log.date.split("T")[0] === date) {
          entry[vehicleLabel] += mode === "fuel_amount" ? log.fuelAmount : log.fuelCost;
        }
      });

      return entry;
    });

    return groupedData;
  };

  const visibleData = chartData.map((entry) => {
    const filteredEntry = { date: entry.date };
    Object.keys(entry).forEach((key) => {
      if (key !== "date" && visibleVehicles[key]) {
        filteredEntry[key] = entry[key];
      }
    });
    return filteredEntry;
  });

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: colors.primary[400] + " !important",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Side Section with Title and Toggles */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "25%",
          paddingRight: "10px",
        }}
      >
        {/* Vehicle Toggles */}
        <FormGroup sx={{ mb: 2, gap: "10px" }}>
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
                    color: barColors[index % barColors.length],
                    "&.Mui-checked": {
                      color: barColors[index % barColors.length],
                    },
                  }}
                />
              }
              label={vehicle}
              sx={{ color: barColors[index % barColors.length] }}
            />
          ))}
        </FormGroup>

        {/* Toggle Buttons for View Mode */}
        <ButtonGroup
          orientation="vertical" // Stack buttons vertically
          variant="contained"
          sx={{
            gap: "5px",
          }}
        >
          <Button
            onClick={() => setViewMode("fuel_amount")}
            sx={{
              backgroundColor:
                viewMode === "fuel_amount"
                  ? colors.greenAccent[500]
                  : colors.grey[400],
              color:
                viewMode === "fuel_amount"
                  ? colors.grey[900]
                  : colors.grey[700],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            Fuel Amount
          </Button>
          <Button
            onClick={() => setViewMode("fuel_cost")}
            sx={{
              backgroundColor:
                viewMode === "fuel_cost"
                  ? colors.greenAccent[500]
                  : colors.grey[400],
              color:
                viewMode === "fuel_cost" ? colors.grey[900] : colors.grey[700],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            Fuel Cost
          </Button>
        </ButtonGroup>
      </Box>

      {/* Bar Chart */}
      <Box
        style={{
          height: "400px",
          width: "75%",
        }}
      >
        {visibleData.length > 0 ? (
          <ResponsiveBar
            data={visibleData}
            keys={Object.keys(visibleVehicles).filter(
              (key) => visibleVehicles[key]
            )}
            indexBy="date"
            margin={{ top: 30, right: 50, bottom: 80, left: 50 }}
            padding={0.3}
            colors={({ id }) =>
              barColors[Object.keys(visibleVehicles).indexOf(id) % barColors.length]
            } // Use barColors for bars
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: colors.grey[100], // Set the axis line color
                  },
                },
                legend: {
                  text: {
                    fill: colors.grey[100], // Set the legend text color
                  },
                },
                ticks: {
                  line: {
                    stroke: colors.grey[100], // Set the tick line color
                  },
                  text: {
                    fill: colors.grey[100], // Set the tick text color
                  },
                },
              },
              grid: {
                line: {
                  stroke: colors.grey[300], // Grid lines
                  strokeWidth: 1,
                },
              },
              tooltip: {
                container: {
                  color: colors.primary[500], // Tooltip background color
                },
              },
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend:
                viewMode === "fuel_amount"
                  ? "Fuel Amount (L)"
                  : "Fuel Cost (MAD)",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            legends={[]}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
