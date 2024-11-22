import {
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GPSMap from "../../components/GPSMap";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import OdometerDisplay from "../../components/Odometer";
import VehicleCount from "../../components/VehicleCount";
import { useEffect, useState } from "react";
import CarModel from "../../components/CarModel";
import FuelTransactions from "../../components/FuelTransactions";
import VehicleSelector from "../../components/VehicleSelector";
import TrackerBarCharts from "../../components/TrackerBarCharts";
import DownloadButton from "../../components/DownloadButton";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedVehicle, setSelectedVehicle] = useState(""); // State to track the selected vehicle

  // Load the saved vehicle from localStorage on mount
  useEffect(() => {
    const savedVehicle = localStorage.getItem("selectedVehicle");
    if (savedVehicle) {
      setSelectedVehicle(savedVehicle); // Set the saved value as the initial state
    }
  }, []);

  // Save the selected vehicle to localStorage whenever it changes
  useEffect(() => {
    if (selectedVehicle) {
      localStorage.setItem("selectedVehicle", selectedVehicle);
    }
  }, [selectedVehicle]);

  return (
    <div id="dashboard">
    <Box m="20px">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="20px"
      >
        {/* Vehicle Selector on the left */}
        <Box flex="1">
          <VehicleSelector
            selectedVehicle={selectedVehicle} // Pass the current selected vehicle
            setSelectedVehicle={setSelectedVehicle} // Pass the setter function
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
            }}
          />
        </Box>

        {/* Title in the center */}
        <Box flex="2" textAlign="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </Box>

        {/* Download Button on the right */}
        <Box flex="1" textAlign="right">
        <DownloadButton colors={colors} />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        {/* Drivers Count */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          flexDirection="row"
          padding="20px"
        >
          {/* Description on the left */}
          <Typography
            variant="h6"
            color={colors.greenAccent[400]}
            mb={10}
            textAlign="left"
          >
            Device Status
          </Typography>

          {/* Chart on the right */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="120px"
            width="120px"
          >
            <PieChart isDashboard={true} />
          </Box>
        </Box>
        {/* Vehicle Count */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <VehicleCount />
        </Box>

        {/* Odometer */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <OdometerDisplay selectedVehicle={selectedVehicle} />
        </Box>

        {/* Total Distance */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <CarModel selectedVehicle={selectedVehicle} />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          sx={{

            maxHeight: "550px",
            borderRadius: "10px", 
          }}
        >
          {/* Fuel Logs Overview */}
          
          <Box height="300px">
          <Typography variant="h6" fontWeight="600">
              Fuel Logs Overview
            </Typography>
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        {/* Fuel Transactions */}
        <Box gridColumn="span 4" gridRow="span 3">
          <FuelTransactions selectedVehicle={selectedVehicle} />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]} 
        >
          <Box
            sx={{
              padding: "10px",
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
            }}
          >
            <Typography variant="h6" fontWeight="600">
              Tracker Status
            </Typography>
          </Box>
          <TrackerBarCharts selectedVehicle={selectedVehicle} />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Chart Title */}
          <Box
            sx={{
              padding: "10px",
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
            }}
          >
            <Typography variant="h6" fontWeight="600">
              Distance Traveled
            </Typography>
          </Box>

          {/* Chart Container */}
          <Box
            sx={{
              // height: "200px",
              marginTop: "-40px",
              //   display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              // overflow: "hidden",
            }}
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="20px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            GPS
          </Typography>
          <Box height="200px" width="100%" overflow="hidden" display="flex" justifyContent="center" alignItems="center" >
            <GPSMap isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  </div>
  );
};

export default Dashboard;
