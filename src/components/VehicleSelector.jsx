import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { fetchVehicles } from "../api/dataService";

const VehicleSelector = ({ selectedVehicle, setSelectedVehicle, sx }) => {
    const [vehicles, setVehicles] = useState([]);
  
    useEffect(() => {
      const loadVehicles = async () => {
        try {
          const data = await fetchVehicles(); // Fetch vehicles
          setVehicles(data);
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      };
      loadVehicles();
    }, []);
  
    return (
    <Box>
      <FormControl fullWidth  variant="filled" sx={{  minWidth: 120 }}>
        <InputLabel>Select Vehicle</InputLabel>
        <Select
          value={selectedVehicle || ""} // Ensure the value is controlled
          onChange={(e) => setSelectedVehicle(e.target.value)} // Update parent state
        >
          {vehicles.map((vehicle) => (
            <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
              {vehicle.make} ({vehicle.plateNumber})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    );
  };
  
  export default VehicleSelector;
  

