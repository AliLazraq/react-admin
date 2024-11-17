import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GPSMap from "../../components/GPSMap";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import Odometer from "../../components/Odometer";
import VehicleCount from "../../components/VehicleCount";
import { useEffect, useState } from "react";
import CarModel from "../../components/CarModel";
import FuelTransactions from "../../components/FuelTransactions";
import VehicleSelector from "../../components/VehicleSelector";

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
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
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
          <Odometer selectedVehicle={selectedVehicle} />
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
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          sx={{
            overflow: "auto", // Enable scrolling
            maxHeight: "400px", // Set a fixed maximum height for the container
            borderRadius: "10px", // Optional: for better visuals
          }}
        >
          {/* Chart Title */}
          {/* Chart Title */}
          <Box
            sx={{
              display: "flex", // Flexbox to arrange items
              justifyContent: "space-between", // Space between title and icon
              alignItems: "center", // Center vertically
              padding: "10px",
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              borderRadius: "8px", // Optional: for rounded corners
            }}
          >
            <Typography variant="h6" fontWeight="600">
              Fuel Logs Overview
            </Typography>
            <IconButton>
              <DownloadOutlinedIcon
                sx={{
                  fontSize: "26px",
                  color: colors.greenAccent[500],
                }}
              />
            </IconButton>
          </Box>

          <Box
            mt="0px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box></Box>
          </Box>
          <Box height="400px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* Fuel Transactions */}
        <FuelTransactions selectedVehicle={selectedVehicle} />

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Number of Devices
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            {/* Active vs Inactive in one line */}
            <Box display="flex" alignItems="center" sx={{ mt: "15px" }}>
              <Typography variant="h5" color={colors.greenAccent[500]}>
                Active
              </Typography>
              <Typography variant="h5" color="#ffffff" sx={{ ml: "5px" }}>
                vs
              </Typography>
              <Typography
                variant="h5"
                color={colors.blueAccent[500]}
                sx={{ ml: "5px" }}
              >
                Inactive
              </Typography>
            </Box>

            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
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
              padding: "15px",
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
          <Box height="200px" width="100%" overflow="hidden">
            {" "}
            {/* Constrain the height */}
            <GPSMap isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
