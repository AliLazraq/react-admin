// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Add Authorization header with the JWT token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthorizationToken = (token) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

export default axiosInstance;
