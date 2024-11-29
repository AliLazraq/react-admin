import React from "react";
import { Box, Typography } from "@mui/material";

const SingleBarChart = ({ operationType, value, maxRange }) => {
  const percentage = (Math.abs(value) / maxRange) * 100; // Calculate the percentage to fill
  const isEmpty = value === 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        gap: "10px",
      }}
    >
      {/* Operation Type */}
      <Typography
        variant="h6"
        sx={{
          flex: "0 0 180px",
          textAlign: "center",
          fontWeight: "normal",
        }}
      >
        {operationType}
      </Typography>

      {/* Bar Container */}
      <Box
        sx={{
          flex: "1 1 auto",
          position: "relative",
          height: "30px",
          background: `linear-gradient(to right, ${
            isEmpty ? "#e0e0e0" : value < 0 ? "#f47560" : "#61cdbb"
          } ${isEmpty ? "0%" : `${percentage}%`}, #e0e0e0 ${percentage}%)`,
          borderRadius: "5px",
          overflow: "hidden",
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
            color: "#000000",
          }}
        >
          {isEmpty ? "Empty: Select a Vehicle!" : value < 0 ? `Overdue: ${Math.abs(value)}!` : `Remaining: ${Math.abs(value)}`}
        </Typography>
      </Box>

      {/* Max Range */}
      <Typography
        variant="body2"
        sx={{
          flex: "0 0 100px",
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        Max: {maxRange}
      </Typography>
    </Box>
  );
};

export default SingleBarChart;
