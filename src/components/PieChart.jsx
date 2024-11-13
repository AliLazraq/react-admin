import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { fetchDeviceStatusCounts } from "../api/dataService";

const PieChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDeviceStatusCounts();
        setData([
          { id: "Active", label: "Active", value: result.active, color: colors.redAccent[500] },
          { id: "Inactive", label: "Inactive", value: result.inactive, color: colors.blueAccent[500] },
        ]);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <ResponsivePie
  data={data}
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
          strokeWidth: 1,
        },
        text: {
          fill: colors.grey[100],
        },
      },
    },
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
    tooltip: {
      container: {
        color: colors.primary[500],
      },
    },
  }}
  colors={(d) => d.data.color} // Ensure color is taken from data object
  colorBy="id" // Use the id for color mapping
  margin={{ top: 50, right: 110, bottom: 60, left: 60 }}
  innerRadius={0.5}
  padAngle={0.7}
  cornerRadius={3}
  activeOuterRadiusOffset={8}
  borderColor={{
    from: "color",
    modifiers: [["darker", 0.2]],
  }}
  enableArcLinkLabels={false} // Disable arc link labels to remove connecting lines
  arcLabelsRadiusOffset={0.4}
  arcLabelsSkipAngle={7}
  arcLabelsTextColor={{
    from: "color",
    modifiers: [["darker", 2]],
  }}
  enableArcLabels={!isDashboard}
  legends={[
    {
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 56,
      itemsSpacing: 50,
      itemWidth: 10,
      itemHeight: 20,
      itemTextColor: colors.grey[100],
      itemDirection: "left-to-right",
      itemOpacity: 1,
      symbolSize: 10,
      symbolShape: "circle",
      effects: [
        {
          on: "hover",
          style: {
            itemBackground: "rgba(0, 0, 0, .03)",
            itemOpacity: 1,
          },
        },
      ],
    },
  ]}
/>
  );
};

export default PieChart;
