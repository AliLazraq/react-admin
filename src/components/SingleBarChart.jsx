import React from "react";
import { Box, Typography } from "@mui/material";

const SingleBarChart = ({ operationType, value, maxRange }) => {
  // Convert overdue value to positive for display purposes
  const displayedValue = Math.abs(value);
  const percentage = (displayedValue / maxRange) * 100; // Calculate the percentage to fill

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        gap: "10px", // Uniform spacing
      }}
    >
      {/* Operation Type */}
      <Typography
        variant="h6"
        sx={{
          flex: "0 0 180px", // Fixed width for consistent alignment
          textAlign: "center", // Align text to the right
          fontWeight: "normal",
        }}
      >
        {operationType}
      </Typography>

      {/* Bar Container */}
      <Box
        sx={{
          flex: "1 1 auto", // Allow the bar to stretch
          position: "relative",
          height: "30px", // Adjust bar height
          background: `linear-gradient(to right, ${
            value < 0 ? "#f47560" : "#61cdbb"
          } ${percentage}%, #e0e0e0 ${percentage}%)`, // Gradient to fill the proportion
          borderRadius: "5px", // Rounded corners for the bar
          overflow: "hidden", // Ensure no overflow beyond the container
        }}
      >
        {/* Value Label */}
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000000", // Black text for better visibility
          }}
        >
          {value < 0 ? `Overdue: ${displayedValue} !!!` : `Remaining: ${displayedValue}`}
        </Typography>
      </Box>

      {/* Max Range */}
      <Typography
        variant="body2"
        sx={{
          flex: "0 0 100px", // Fixed width for consistent alignment
          textAlign: "left", // Align text to the left
          fontWeight: "bold",
        }}
      >
        Max: {maxRange}
      </Typography>
    </Box>
  );
};

export default SingleBarChart;
