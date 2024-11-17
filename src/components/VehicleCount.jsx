import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchVehicleCount } from "../api/dataService";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const VehicleCount = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    const loadVehicleCount = async () => {
      try {
        const count = await fetchVehicleCount();
        setVehicleCount(count);
      } catch (error) {
        console.error("Failed to fetch vehicle count", error);
      }
    };

    loadVehicleCount();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      backgroundColor={colors.primary[400]}
      padding="20px"
      borderRadius="8px"
      height="100%"
      position="relative" // Make the main container relative
    >
      {/* Subtitle at top left */}
      <Typography variant="h6" color={colors.greenAccent[400]}>
        Vehicles Connected
      </Typography>

      {/* Count on the right */}
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Typography variant="h4" color={colors.grey[100]}>
          {vehicleCount}
        </Typography>
      </Box>

      {/* Car icon positioned at the bottom left */}
      <Box position="absolute" bottom="10px" left="10px">
        <DirectionsCarIcon style={{ width: "30px", height: "30px", color: colors.primary[100] }} />
      </Box>
    </Box>
  );
};

export default VehicleCount;
