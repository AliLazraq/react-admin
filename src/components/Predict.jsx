import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function Predict() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    car_type: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    distanceKm: "",
    color: "",
    body_style: "",
  });

  const [priceInfo, setPriceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trims = ["Base", "LX", "EX", "Sport", "Limited"];
  const colorsOptions = ["Black", "White", "Grey", "Red", "Blue"];
  const bodyStyles = ["Sedan", "SUV", "Hatchback", "Wagon", "Convertible"];

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const miles = Math.round(formData.distanceKm * 0.621371); // Convert KM to Miles
    const apiData = { ...formData, miles };
    const apiUrl = "https://mc-api.marketcheck.com/v2/predict/car/price"; // Example API for demonstration

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${apiUrl}?api_key=tIs5GK10FmnsQ9WO4pDlQzJjDYu6Wn7b&` +
          new URLSearchParams(apiData)
      );
      const priceData = response.data;
      await convertCurrency(priceData.predicted_price, priceData.price_range);
    } catch (error) {
      setError(
        "Error fetching data: " +
          (error.response ? error.response.data.message : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async (usd, range) => {
    try {
      const result = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const rate = result.data.rates.MAD;
      const convertedPrice = usd * rate;
      const lowerBound = range.lower_bound * rate;
      const upperBound = range.upper_bound * rate;
      setPriceInfo({
        predicted_price: convertedPrice,
        price_range: { lower_bound: lowerBound, upper_bound: upperBound },
      });
    } catch (error) {
      setError("Currency conversion error: " + error.message);
    }
  };

  return (
    <Paper
      style={{
        padding: "20px",
        margin: "20px",
        background: colors.primary[400],
      }}
    >
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          fullWidth
          label="Car Type"
          name="car_type"
          value={formData.car_type}
          onChange={handleChange}
          variant="outlined"
          sx={{ input: { color: colors.grey[100] } }}
        />
        <TextField
          fullWidth
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          variant="outlined"
          sx={{ input: { color: colors.grey[100] } }}
        />
        <TextField
          fullWidth
          label="Make"
          name="make"
          value={formData.make}
          onChange={handleChange}
          variant="outlined"
          sx={{ input: { color: colors.grey[100] } }}
        />
        <TextField
          fullWidth
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          variant="outlined"
          sx={{ input: { color: colors.grey[100] } }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel id="trim-label" style={{ color: colors.grey[100] }}>
            Trim
          </InputLabel>
          <Select
            label="Trim"
            labelId="trim-label"
            value={formData.trim}
            onChange={handleChange}
            name="trim"
            style={{ color: colors.grey[100] }}
          >
            {trims.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="color-label" style={{ color: colors.grey[100] }}>
            Color
          </InputLabel>
          <Select
            label="Color"
            labelId="color-label"
            value={formData.color}
            onChange={handleChange}
            name="color"
            style={{ color: colors.grey[100] }}
          >
            {colorsOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="body-style-label" style={{ color: colors.grey[100] }}>
            Body Style
          </InputLabel>
          <Select
            label="Body Style"
            labelId="body-style-label"
            value={formData.body_style}
            onChange={handleChange}
            name="body_style"
            style={{ color: colors.grey[100] }}
          >
            {bodyStyles.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Distance in KM"
          name="distanceKm"
          value={formData.distanceKm}
          onChange={handleChange}
          variant="outlined"
          sx={{ input: { color: colors.grey[100] } }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{
            alignSelf: "center",
            marginTop: "20px",
            padding: "10px",
            backgroundColor: colors.greenAccent[500],
            color: colors.grey[900],
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Get Price"}
        </Button>
      </Box>
      {priceInfo && (
        <Box
          sx={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Predicted Price
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: "10px",
              color: colors.greenAccent[500],
            }}
          >
            {priceInfo.predicted_price.toFixed(2)} MAD
          </Typography>
          <Typography variant="h6" gutterBottom>
            Price Range
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: colors.blueAccent[500], fontWeight: "bold" }}
          >
            {priceInfo.price_range.lower_bound.toFixed(2)} -{" "}
            {priceInfo.price_range.upper_bound.toFixed(2)} MAD
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default Predict;
