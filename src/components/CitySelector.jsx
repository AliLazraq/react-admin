import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  fetchCityGeofences,
  fetchVehicles,
  checkCityGeofenceBreach,
} from "../api/dataService";

const CitySelector = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // Load cities and vehicles on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const cityData = await fetchCityGeofences();
        setCities(cityData);

        const vehicleData = await fetchVehicles(); // Fetch all vehicles
        setVehicles(vehicleData);

        // Retrieve persisted city and vehicle from local storage
        const persistedCity = localStorage.getItem("selectedCity");
        const persistedVehicle = localStorage.getItem("selectedVehicle");
        if (persistedCity) {
          setSelectedCity(persistedCity);
        }
        if (persistedVehicle) {
          setSelectedVehicle(persistedVehicle);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    loadData();
  }, []);

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);

    // Persist the selected city in local storage
    localStorage.setItem("selectedCity", city);
  };

  const handleVehicleChange = (event) => {
    const vehicle = event.target.value;
    setSelectedVehicle(vehicle);

    // Persist the selected vehicle in local storage
    localStorage.setItem("selectedVehicle", vehicle);
  };

  const handleCheckBreach = async () => {
    if (!selectedVehicle || !selectedCity) {
      alert("Please select a city and a vehicle.");
      return;
    }
    try {
      const vehicleId = selectedVehicle.split(" ")[0]; // Extract vehicleId
      await checkCityGeofenceBreach(vehicleId, selectedCity);
    } catch (error) {
      console.error("Failed to check geofence breach:", error);
      alert("An error occurred while checking the geofence.");
    }
  };

  return (
    <Box p={3}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select City</InputLabel>
        <Select value={selectedCity} onChange={handleCityChange}>
          {cities.map((city) => (
            <MenuItem key={city.geofenceId} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Vehicle</InputLabel>
        <Select value={selectedVehicle} onChange={handleVehicleChange}>
          {vehicles.map((vehicle) => (
            <MenuItem
              key={vehicle.vehicleId}
              value={`${vehicle.vehicleId} ${vehicle.make} (${vehicle.plateNumber})`}
            >
              {vehicle.make} ({vehicle.plateNumber})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleCheckBreach(); // Call your existing function
          window.location.reload(); // Reload the page
        }}
      >
        Check Geofence Breach
      </Button>
    </Box>
  );
};

export default CitySelector;
