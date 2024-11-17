import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { fetchCityGeofences, checkCityGeofenceBreach } from '../api/dataService';

const CitySelector = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [deviceId, setDeviceId] = useState(''); // Correctly handles device ID input

  // Load cities and persist selected city on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityData = await fetchCityGeofences();
        setCities(cityData);

        // Retrieve persisted city from local storage
        const persistedCity = localStorage.getItem('selectedCity');
        if (persistedCity) {
          setSelectedCity(persistedCity);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    loadCities();
  }, []);

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);

    // Persist the selected city in local storage
    localStorage.setItem('selectedCity', city);
  };

  const handleDeviceIdChange = (event) => {
    setDeviceId(event.target.value); // Properly updates the deviceId state
  };

  const handleCheckBreach = async () => {
    if (!deviceId || !selectedCity) {
      alert('Please select a city and enter a device ID.');
      return;
    }
    try {
      const response = await checkCityGeofenceBreach(deviceId, selectedCity);
    } catch (error) {
      console.error('Failed to check geofence breach:', error);
      alert('An error occurred while checking the geofence.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        City Geofencing
      </Typography>

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

      <TextField
        label="Device ID"
        value={deviceId}
        onChange={handleDeviceIdChange} // Correctly handles input changes
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleCheckBreach}>
        Check Geofence Breach
      </Button>
    </Box>
  );
};

export default CitySelector;
