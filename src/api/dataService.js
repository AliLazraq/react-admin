import axios from "axios";

// Define the base URL using the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to fetch all AVL data from the backend
export const fetchAvlData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/avldata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AVL data:", error);
    throw error;
  }
};

// Function to fetch all CAN data from the backend
export const fetchCanData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CAN data:", error);
    throw error;
  }
};

// Function to fetch all Devices data from the backend
export const fetchDevices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Devices data:", error);
    throw error;
  }
};

// Function to fetch all Fuel data from the backend
export const fetchFuelData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fueldata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Fuel data:", error);
    throw error;
  }
};

// Function to fetch all IO data from the backend
export const fetchIoData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/iodata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IO data:", error);
    throw error;
  }
};

// Function to fetch all Vehicles data from the backend
export const fetchVehicles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Vehicles data:", error);
    throw error;
  }
};

// Function to fetch Active vs inactive devices data
export const fetchDeviceStatusCounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices/status-count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching device status counts:", error);
    throw error;
  }
};

// Function to fetch Vehicle count from the backend
export const fetchVehicleCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles/count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle count:", error);
    throw error;
  }
};


// Fetch fuel logs for a specific vehicle
export const fetchFuelLogsById = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fuel-logs/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fuel logs for vehicle:", error);
    throw error;
  }
};

// Fetch fuel logs for all vehicles
export const fetchFuelLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fuel-logs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all fuel logs:", error);
    throw error;
  }
};


// Function to fetch latest odometer reading from fuel-logs by id the backend
export const fetchLatestOdometerReading = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fuel-logs/latest/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest odometer reading:", error);
    throw error;
  }
};

// Fetch all cities for geofencing
export const fetchCityGeofences = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/city-geofencing`);
    console.log("Geofences fetched:", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error fetching geofences:", error); // Log detailed error
    throw error;
  }
};

// Check geofence breach for a specific device and city
export const checkCityGeofenceBreach = async (deviceId, cityName) => {
  const response = await axios.post(`${API_BASE_URL}/city-geofencing/check-breach`, {
    deviceId,
    cityName,
  });
  return response.data; // Return the full response to handle breach status
};

// Fetch all alerts
export const fetchAlerts = async () => {
  const response = await axios.get(`${API_BASE_URL}/alerts`);
  return response.data;
};

// Delete all alerts
export const deleteAllAlerts = async () => {
  console.log("Deleting all alerts...");
  const response = await axios.delete(`${API_BASE_URL}/alerts/delete-all`);
  return response.data;
};

// Fetch latest GPS data
export const fetchGpsData = async () => {
  const response = await axios.get(`${API_BASE_URL}/gps/latest`);
  return response.data;
};

// Fetch vehicle by ID
export const fetchVehicleById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
};

// Fetch for the join of vehicles and fuel logs
export const fetchVehicleFuelLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fuel-logs/fuel-logs-with-vehicle`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle fuel logs:", error);
    throw error;
  }
};

// fetch avl data by vehicle id
export const fetchAvlDataByDeviceId = async (DeviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/avldata/device/${DeviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AVL data by vehicle ID:", error);
    throw error;
  }
};

// Fetch fuel logs for a specific vehicle for maintenance alerts
export const fetchMaintenanceAlerts = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/maintenance/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance alerts:', error);
    throw error;
  }
};

// Fetch maintenance alerts with odometer
export const fetchMaintenanceAlertsWithOdometer = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/maintenance/alerts/${vehicleId}`);
    return response.data; // Will include both currentOdometer and maintenanceList
  } catch (error) {
    console.error('Error fetching maintenance alerts:', error);
    throw error;
  }
};


// Fetch trackers for vehicles
export const fetchTrackers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tracker`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trackers:", error);
    throw error;
  }
};

// Fetch latest odometer
export const fetchLatestOdometer = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fuel-logs/latest/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest odometer:", error);
    throw error;
  }
};

// Fetch trackers by vehicle ID
export const fetchTrackersByVehicleId = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tracker/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trackers by vehicle ID:", error);
    throw error;
  }
};

// Post a new maintenance record by vehicle ID
export const postMaintenanceRecord = async (vehicleId, maintenanceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/maintenance/${vehicleId}`, maintenanceData);
    return response.data;
  } catch (error) {
    console.error("Error posting maintenance record:", error);
    throw error;
  }
};
