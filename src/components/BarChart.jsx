import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { fetchFuelLogs, fetchVehicleById } from "../api/dataService";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const loadBarData = async () => {
      try {
        const fuelLogs = await fetchFuelLogs();

        // Group fuel logs by vehicleId and find the last odometer for each vehicle
        const groupedLogs = fuelLogs.reduce((acc, log) => {
          if (!acc[log.vehicleId] || new Date(acc[log.vehicleId].date) < new Date(log.date)) {
            acc[log.vehicleId] = log;
          }
          return acc;
        }, {});

        const vehicleData = await Promise.all(
          Object.keys(groupedLogs).map(async (vehicleId) => {
            const vehicleDetails = await fetchVehicleById(vehicleId);
            return {
              vehicle: `${vehicleDetails.make} ${vehicleDetails.model}`,
              odometer: groupedLogs[vehicleId].odometer,
            };
          })
        );

        setBarData(vehicleData);
      } catch (error) {
        console.error("Error loading bar chart data:", error);
      }
    };

    loadBarData();
  }, []);

  return (
    <ResponsiveBar
      data={barData}
      keys={["odometer"]}
      indexBy="vehicle"
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -30,
        legend: isDashboard ? undefined : "Vehicle",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Odometer",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{ on: "hover", style: { itemOpacity: 1 } }],
        },
      ]}
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} for vehicle: ${e.indexValue}`}
    />
  );
};

export default BarChart;
