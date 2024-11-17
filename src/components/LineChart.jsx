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
import { fetchFuelLogs } from "../api/dataService";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState("fuel_amount"); // Toggle between `fuel_amount` and `fuel_cost`
  const [showVehicle1, setShowVehicle1] = useState(true); // Show/Hide Vehicle 1
  const [showVehicle2, setShowVehicle2] = useState(true); // Show/Hide Vehicle 2

  useEffect(() => {
    const loadChartData = async () => {
      const fuelLogs = await fetchFuelLogs();
      const filteredDates = getFilteredDates(fuelLogs);
      const vehicle1Data = createChartData(fuelLogs, 1, filteredDates, viewMode);
      const vehicle2Data = createChartData(fuelLogs, 2, filteredDates, viewMode);
      setChartData([vehicle1Data, vehicle2Data]);
    };
    loadChartData();
  }, [viewMode]);

  const getFilteredDates = (fuelLogs) => {
    // Extract unique dates with fuel logs
    const dates = fuelLogs.map((log) => log.date.split("T")[0]);
    return [...new Set(dates)].sort();
  };

  const createChartData = (fuelLogs, vehicleId, filteredDates, mode) => {
    const filteredLogs = fuelLogs.filter((log) => log.vehicleId === vehicleId);
    const groupedLogs = filteredDates.map((date) => {
      const dailyLogs = filteredLogs.filter(
        (log) => log.date.split("T")[0] === date
      );
      const value = dailyLogs.reduce((sum, log) => {
        if (mode === "fuel_amount") return sum + log.fuelAmount;
        if (mode === "fuel_cost") return sum + log.fuelCost;
        return sum;
      }, 0);

      return {
        date,
        [`Vehicle ${vehicleId}`]: value || 0,
      };
    });

    return groupedLogs;
  };

  const combineChartData = (vehicle1Data, vehicle2Data) => {
    const combined = [];
    vehicle1Data.forEach((entry, index) => {
      combined.push({
        date: entry.date,
        "Vehicle 1": entry["Vehicle 1"],
        "Vehicle 2": vehicle2Data[index]["Vehicle 2"],
      });
    });
    return combined;
  };

  const visibleData = combineChartData(
    chartData[0] || [],
    chartData[1] || []
  ).map((entry) => {
    const filteredEntry = { date: entry.date };
    if (showVehicle1) filteredEntry["Vehicle 1"] = entry["Vehicle 1"];
    if (showVehicle2) filteredEntry["Vehicle 2"] = entry["Vehicle 2"];
    return filteredEntry;
  });

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: colors.primary[400],
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
          <FormControlLabel
            control={
              <Checkbox
                checked={showVehicle1}
                onChange={(e) => setShowVehicle1(e.target.checked)}
                sx={{
                  color: showVehicle1 ? "#e41a1c" : "rgba(255, 255, 255, 0.5)", // Red for Vehicle 1
                  "&.Mui-checked": {
                    color: "#e41a1c", // Red for checked
                  },
                }}
              />
            }
            label="Vehicle 1"
            sx={{ color: colors.grey[100] }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showVehicle2}
                onChange={(e) => setShowVehicle2(e.target.checked)}
                sx={{
                  color: showVehicle2 ? "#377eb8" : "rgba(255, 255, 255, 0.5)", // Blue for Vehicle 2
                  "&.Mui-checked": {
                    color: "#377eb8", // Blue for checked
                  },
                }}
              />
            }
            label="Vehicle 2"
            sx={{ color: colors.grey[100] }}
          />
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
            color={viewMode === "fuel_amount" ? "primary" : "default"}
          >
            Fuel Amount
          </Button>
          <Button
            onClick={() => setViewMode("fuel_cost")}
            color={viewMode === "fuel_cost" ? "primary" : "default"}
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
            keys={["Vehicle 1", "Vehicle 2"]}
            indexBy="date"
            margin={{ top: 30, right: 50, bottom: 80, left: 50 }}
            padding={0.3}
            colors={{ scheme: "set1" }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Date",
              legendOffset: 36,
              legendPosition: "middle",
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
