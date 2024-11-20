import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  fetchAlerts,
  fetchCityGeofences,
  fetchVehicles,
  deleteAllAlerts,
} from "../api/dataService";

const AlertDisplay = () => {
  const [alerts, setAlerts] = useState([]);
  const [cities, setCities] = useState({});
  const [vehicles, setVehicles] = useState({}); // Map to store vehicle data

  // Load alerts, cities, and vehicles
  useEffect(() => {
    const loadData = async () => {
      try {
        const alertData = await fetchAlerts();
        const cityData = await fetchCityGeofences();
        const vehicleData = await fetchVehicles();

        // Convert city data to a map for quick lookup
        const cityMap = cityData.reduce((acc, city) => {
          acc[city.geofenceId] = city.name;
          return acc;
        }, {});

        // Convert vehicle data to a map for quick lookup
        const vehicleMap = vehicleData.reduce((acc, vehicle) => {
          acc[vehicle.vehicleId] = {
            make: vehicle.make,
            plateNumber: vehicle.plateNumber,
          };
          return acc;
        }, {});

        setAlerts(alertData);
        setCities(cityMap);
        setVehicles(vehicleMap);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  // Handle deleting all alerts
  const handleDeleteAllAlerts = async () => {
    try {
      console.log("Delete All Alerts button clicked");
      const response = await deleteAllAlerts();
      console.log("Backend response:", response);
      setAlerts([]); // Clear alerts from state
      alert("All breach alerts have been deleted.");
    } catch (error) {
      console.error(
        "Failed to delete alerts:",
        error.response || error.message || error
      );
      alert("An error occurred while deleting alerts.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Breach Alerts
      </Typography>

      {alerts.length > 0 ? (
        <>
          <ul>
            {alerts.map((alert) => {
              const vehicle = vehicles[alert.vehicleId]; // Find vehicle details
              const cityName = cities[alert.geofenceId]; // Find city name

              return (
                <li
                  key={alert.alertId}
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  <Typography variant="h6">
                    {vehicle
                      ? `The car ${vehicle.make} (${vehicle.plateNumber}) breached the geofence of ${cityName}!`
                      : `Vehicle ID ${alert.vehicleId} breached the geofence of ${cityName}!`}{" "}
                    ({new Date(alert.timestamp).toLocaleString()})
                  </Typography>
                </li>
              );
            })}
          </ul>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteAllAlerts}
            style={{ marginTop: "20px" }}
          >
            Delete All Alerts
          </Button>
        </>
      ) : (
        <Typography>No breach alerts available.</Typography>
      )}
    </Box>
  );
};

export default AlertDisplay;
