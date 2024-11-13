import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { fetchGpsData } from "../api/dataService"; // Import function to fetch GPS data

// Custom icon for the FM5300 device
const carIcon = new L.Icon({
    iconUrl: "../../assets/car.png", 
    iconSize: [30, 30], 
});

const GPSMap = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gpsData, setGpsData] = useState([]);

  useEffect(() => {
    // Load GPS data from the backend
    const loadGpsData = async () => {
      try {
        const data = await fetchGpsData(); // Fetches the latitude, longitude, speed, and timestamp
        setGpsData(data);
      } catch (error) {
        console.error("Error fetching GPS data:", error);
      }
    };
    loadGpsData();
  }, []);

  // Extract coordinates for the polyline path
  const pathCoordinates = gpsData.map((data) => [data.latitude, data.longitude]);

  return (
    <MapContainer
      center={[33.5333, -5.1167]} // Centered on Ifrane, Morocco
      zoom={15} // Adjust zoom level as needed
      style={{
        height: isDashboard ? "400px" : "75vh",
        width: "100%",
        border: `1px solid ${colors.grey[100]}`,
        borderRadius: "4px",
      }}
    >
      {/* Tile layer for the map background */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Plot each GPS point */}
      {gpsData.map((data, index) => (
        <Marker key={index} position={[data.latitude, data.longitude]} icon={carIcon}>
          <Popup>
            <strong>Speed:</strong> {data.speed} km/h <br />
            <strong>Time:</strong> {data.timestamp}
          </Popup>
        </Marker>
      ))}

      {/* Draw polyline for the device path */}
      <Polyline positions={pathCoordinates} color="blue" />
    </MapContainer>
  );
};

export default GPSMap;
