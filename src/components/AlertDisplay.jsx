import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { fetchAlerts, fetchCityGeofences, deleteAllAlerts } from '../api/dataService';

const AlertDisplay = () => {
  const [alerts, setAlerts] = useState([]);
  const [cities, setCities] = useState({});

  // Load alerts and cities
  useEffect(() => {
    const loadData = async () => {
      try {
        const alertData = await fetchAlerts();
        const cityData = await fetchCityGeofences();

        // Convert city data to a map for quick lookup
        const cityMap = cityData.reduce((acc, city) => {
          acc[city.geofenceId] = city.name;
          return acc;
        }, {});

        setAlerts(alertData);
        setCities(cityMap);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Handle deleting all alerts
  const handleDeleteAllAlerts = async () => {
    try {
      console.log('Delete All Alerts button clicked');
      const response = await deleteAllAlerts();
      console.log('Backend response:', response);
      setAlerts([]); // Clear alerts from state
      alert('All breach alerts have been deleted.');
    } catch (error) {
      console.error('Failed to delete alerts:', error.response || error.message || error);
      alert('An error occurred while deleting alerts.');
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
            {alerts.map((alert) => (
              <li key={alert.alertId} style={{ color: 'red', marginBottom: '10px' }}>
                <Typography variant="h6">
                  The car {alert.vehicleId} got outside {cities[alert.geofenceId]}! ({new Date(alert.timestamp).toLocaleString()})
                </Typography>
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteAllAlerts}
            style={{ marginTop: '20px' }}
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
