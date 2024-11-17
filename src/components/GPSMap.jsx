import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

// A helper component to set the map's center dynamically
const SetMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

const GPSMap = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [gpsData, setGpsData] = useState([]);
  const [mapCenter, setMapCenter] = useState([33.5333, -5.1167]); // Default to Ifrane

  useEffect(() => {
    // Load GPS data from the backend
    const loadGpsData = async () => {
      try {
        const data = await fetchGpsData(); // Fetches GPS data including vehicle details
        setGpsData(data);

        // If GPS data is available, center on the latest car position
        if (data.length > 0) {
          const latestPosition = [data[0].latitude, data[0].longitude];
          setMapCenter(latestPosition);
        }
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
      center={mapCenter} // Dynamically set the map's center
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

      {/* Set the map center dynamically */}
      <SetMapCenter center={mapCenter} />

      {/* Plot each GPS point */}
      {gpsData.map((data, index) => (
        <Marker key={index} position={[data.latitude, data.longitude]} icon={carIcon}>
          <Popup>
            <strong>Plate:</strong> {data.plate_number} <br />
            <strong>Make:</strong> {data.make} <br />
            <strong>Model:</strong> {data.model} <br />
            <strong>Speed:</strong> {data.speed} km/h <br />
            <strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default GPSMap;
