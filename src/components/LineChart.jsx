import { ResponsiveLine } from "@nivo/line";
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
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { fetchFuelLogs } from "../api/dataService";

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState("fuel_amount"); // Toggle between `fuel_amount` and `fuel_cost`
  const [showVehicle1, setShowVehicle1] = useState(true); // Show/Hide Vehicle 1
  const [showVehicle2, setShowVehicle2] = useState(true); // Show/Hide Vehicle 2

  useEffect(() => {
    const loadChartData = async () => {
      const fuelLogs = await fetchFuelLogs();
      const last30Days = getLast30Days();
      const vehicle1Data = createChartData(fuelLogs, 1, last30Days, viewMode);
      const vehicle2Data = createChartData(fuelLogs, 2, last30Days, viewMode);
      setChartData([vehicle1Data, vehicle2Data]);
    };
    loadChartData();
  }, [viewMode]);

  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push(day.toISOString().split("T")[0]);
    }
    return days.reverse();
  };

  const createChartData = (fuelLogs, vehicleId, last30Days, mode) => {
    const filteredLogs = fuelLogs.filter((log) => log.vehicleId === vehicleId);
    const groupedLogs = last30Days.map((date) => {
      const dailyLogs = filteredLogs.filter(
        (log) => log.date.split("T")[0] === date
      );
      const value = dailyLogs.reduce(
        (sum, log) =>
          sum + (mode === "fuel_amount" ? log.fuelAmount : log.fuelCost),
        0
      );
      return { x: date, y: value || 0 };
    });
    return {
      id: `Vehicle ${vehicleId}`,
      data: groupedLogs,
    };
  };

  const visibleData = chartData.filter((data) => {
    if (data.id === "Vehicle 1" && showVehicle1) return true;
    if (data.id === "Vehicle 2" && showVehicle2) return true;
    return false;
  });

  return (
    <Paper 
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: colors.primary[400],
        scroll : "auto",
      }}

    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{ marginBottom: "20px", textAlign: "center", color: colors.grey[100] }}
      >
        Fuel Logs Over Last Month
      </Typography>

      {/* Toggle Buttons for View Mode */}
      <ButtonGroup variant="contained" sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
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

      {/* Vehicle Toggle Checkboxes */}
      <FormGroup row sx={{ justifyContent: "center", mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showVehicle1}
              onChange={(e) => setShowVehicle1(e.target.checked)}
              sx={{ color: colors.greenAccent[500] }}
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
              sx={{ color: colors.blueAccent[500] }}
            />
          }
          label="Vehicle 2"
          sx={{ color: colors.grey[100] }}
        />
      </FormGroup>

      {/* Line Chart */}
      <Box style={{ height: "400px", width: "100%" }}>
        {visibleData.length > 0 ? (
          <ResponsiveLine
            data={visibleData}
            margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
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
              legend:
                viewMode === "fuel_amount"
                  ? "Fuel Amount (L)"
                  : "Fuel Cost (MAD)",
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
                translateY: 0,
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

export default LineChart;
