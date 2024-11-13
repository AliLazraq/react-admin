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

// Function to fetch GPS data from the backend
export const fetchGpsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/avldata/gps-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GPS data:", error);
    throw error;
  }
};