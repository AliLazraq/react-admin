import React, { useEffect, useState } from "react";
import { fetchAvlDataByDeviceId, fetchVehicleById } from "../api/dataService";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import {
  Typography,
  Box,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import axios from "axios";

const fetchDeviceData = async (deviceId) => {
  try {
    const data = await fetchAvlDataByDeviceId(deviceId);
    data.reverse();
    return data.slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch last locations:", error);
    return [];
  }
};

const fetchAddressFromCoordinates = async (latitude, longitude) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to respect rate limits
      const response = await axios.get(apiUrl, {
        headers: { "User-Agent": "MyApp/4 (example@example.com)" },
      });
      const address = response.data.address;
      return address
        ? `${address.road || "Unknown Road"}, ${address.city || "Unknown City"}, ${address.country || "Unknown Country"}`
        : "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error.response?.data || error.message);
      return "Unknown Location";
    }
  };
  

const fetchVehicleInfo = async (vehicleId) => {
  try {
    const vehicle = await fetchVehicleById(vehicleId);
    return `${vehicle.make} (${vehicle.plateNumber})`;
  } catch (error) {
    console.error("Error fetching vehicle info:", error);
    return `Vehicle ${vehicleId}`;
  }
};

// Simple Loading Animation
const loadingSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100px",
  "& .dot": {
    width: "22px",
    height: "22px",
    margin: "0 5px",
    borderRadius: "50%",
    backgroundColor: "#1976d2",
    animation: "bounce 1.2s infinite ease-in-out",
    "&:nth-of-type(1)": { animationDelay: "0s" },
    "&:nth-of-type(2)": { animationDelay: "0.2s" },
    "&:nth-of-type(3)": { animationDelay: "0.4s" },
  },
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
};

const DeviceTimeline = ({ deviceId }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleTitle, setVehicleTitle] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const title = await fetchVehicleInfo(deviceId);
        setVehicleTitle(title);

        const data = await fetchDeviceData(deviceId);
        const timelineWithAddresses = await Promise.all(
          data.map(async (item) => {
            const address = await fetchAddressFromCoordinates(
              item.latitude,
              item.longitude
            );
            return { ...item, address };
          })
        );
        setTimelineData(timelineWithAddresses);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [deviceId]);

  if (loading) {
    return (
      <Box sx={loadingSx}>
        <Box className="dot"></Box>
        <Box className="dot"></Box>
        <Box className="dot"></Box>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        padding: "20px",
        marginTop: "20px",
        backgroundColor: isDarkMode ? theme.palette.background.default : "#f4f4f4",
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          marginBottom: "20px",
          color: isDarkMode ? theme.palette.text.primary : "#333",
        }}
      >
        Timeline for {vehicleTitle}
      </Typography>
      <Timeline position="alternate">
        {timelineData.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot
                style={{
                  backgroundColor: item.speed > 20 ? "#d32f2f" : "#388e3c",
                }}
              />
              {index < timelineData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                sx={{
                  padding: "15px",
                  backgroundColor: isDarkMode
                    ? theme.palette.background.paper
                    : "#fff",
                  borderRadius: "8px",
                  boxShadow: isDarkMode
                    ? "0px 0px 5px rgba(255, 255, 255, 0.2)"
                    : "0px 0px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: isDarkMode ? theme.palette.secondary.light : "#1976d2",
                  }}
                >
                  {item.address}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? theme.palette.text.secondary : "#757575",
                    marginTop: "5px",
                  }}
                >
                  <strong>Date:</strong> {new Date(item.timestamp).toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: item.speed > 20 ? "#d32f2f" : "#388e3c",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Speed:</strong> {item.speed} km/h
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? theme.palette.text.secondary : "#757575",
                  }}
                >
                  <strong>Angle:</strong> {item.angle}°
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};

const DeviceTimelines = () => {
  return (
    <Grid container spacing={3} sx={{ marginTop: "20px" }}>
      <Grid item xs={12} md={6}>
        <DeviceTimeline deviceId={1} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DeviceTimeline deviceId={2} />
      </Grid>
    </Grid>
  );
};

export default DeviceTimelines;
