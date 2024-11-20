import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import VehicleSelector from "./VehicleSelector";
import {
  postMaintenanceRecord,
  fetchTrackersByVehicleId,
  fetchLatestOdometer
} from "../api/dataService";

const MaintenanceAlerts = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [currentOdometer, setCurrentOdometer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    operationType: "",
    price: "",
  });

  // Thresholds for operations
  const thresholds = {
    "Oil Change": 10000,
    "Tires Change": 50000,
    "Distribution Chain Change": 150000,
  };



  // Fetch trackers by vehicle id
  const fetchTrackers = async (vehicleId) => {
    try { 
      const trackers = await fetchTrackersByVehicleId(vehicleId);
      setTrackers(trackers);
      console.log("Trackers:", trackers);
    } catch (error) {
      console.error("Error fetching trackers by vehicle ID:", error);
    }
  };


  // Fetch latest odometer
  const fetchOdometer = async (vehicleId) => {
    try {
      const {odometer} = await fetchLatestOdometer(vehicleId);
      setCurrentOdometer(odometer);
    } catch (error) {
      console.error("Error fetching latest odometer:", error);
    }
  };

  useEffect(() => {
    fetchTrackers(selectedVehicle);
    fetchOdometer(selectedVehicle);
  }, [selectedVehicle]);

  // Handle Form Data Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // In your submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.operationType || !formData.price) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const payload = {
        operationType: formData.operationType,
        price: parseFloat(formData.price),
        maintenanceDate: new Date().toISOString(),
      };

      // Call the POST function with the selected vehicle ID
      await postMaintenanceRecord(selectedVehicle, payload);

      await fetchTrackers(selectedVehicle);

      alert("Maintenance record added successfully!");

      // Update the threshold dynamically
      if (formData.operationType in thresholds) {
        thresholds[formData.operationType] =
          currentOdometer + thresholds[formData.operationType];
      }

      setFormData({ operationType: "", price: "" });
    } catch (error) {
      console.error("Error submitting maintenance record:", error);
      alert("Failed to add maintenance record.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Maintenance Alerts
      </Typography>

      {/* Vehicle Selector */}
      <VehicleSelector
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        sx={{ marginBottom: "20px" }}
      />

      {/* Display Alerts */}
      <Grid container spacing={3}>
        {["Oil Change", "Tires Change", "Distribution Chain Change"].map(
          (operation) => {

            // find corresponding tracker
            const tracker = trackers.find(tracker => tracker.operationType === operation);
            const trackerValue = tracker?.value || 0;

            return (
              <Grid item xs={12} md={4} key={operation}>
                <Paper
                  sx={{
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#f4f4f4",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {operation}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    Odometer: {currentOdometer} km
                  </Typography>
                  <Typography
                    sx={{
                      color: trackerValue < 0 ? "red" : "green",
                    }}
                  >
                    {trackerValue <= 0
                      ? `Overdue by ${Math.abs(trackerValue)} km`
                      : `Remaining: ${trackerValue} km`}
                  </Typography>
                </Paper>
              </Grid>
            );
          }
        )}
      </Grid>

      {/* Update Maintenance */}
      {selectedVehicle && (
        <>
          <Typography
            variant="h5"
            sx={{ marginTop: "40px", marginBottom: "20px" }}
          >
            Update Maintenance Record
          </Typography>
          <Paper
            sx={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#f4f4f4",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Operation Type</InputLabel>
                    <Select
                      name="operationType"
                      value={formData.operationType}
                      onChange={handleInputChange}
                      fullWidth
                    >
                      <MenuItem value="Oil Change">Oil Change</MenuItem>
                      <MenuItem value="Tire Change">Tire Change</MenuItem>
                      <MenuItem value="Distribution Chain Change">
                        Distribution Chain Change
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="price"
                    label="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit Maintenance
                </Button>
              </Box>
            </form>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default MaintenanceAlerts;
