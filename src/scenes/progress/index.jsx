import Header from '../../components/Header';
import { Box } from '@mui/material';
import TrackerBarCharts from '../../components/TrackerBarCharts';
import VehicleSelector from "../../components/VehicleSelector";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Progress = () => {
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
    <Box m= "20px">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="20px"
      >
      <Box flex="2">
        <Header title="Maintenance Progress" subtitle="Visuals" />
      </Box>
        {/* Vehicle Selector on the left */}
        <Box>
          <VehicleSelector
            selectedVehicle={selectedVehicle} // Pass the current selected vehicle
            setSelectedVehicle={setSelectedVehicle} // Pass the setter function
            sx={{
              color: colors.grey[100],
            }}
          />
        </Box>
      </Box>
        <Box height="75vh">
        
        <TrackerBarCharts selectedVehicle={selectedVehicle}/>
        </Box>
        </Box>
  );
};

export default Progress;
