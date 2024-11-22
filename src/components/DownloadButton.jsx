import React from "react";
import { Box, Button } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../theme";

const DownloadButton = ({ colors }) => {
  // Function to handle PDF generation
  const handleDownload = async () => {
    const element = document.getElementById("dashboard"); // The element to capture
    if (!element) {
      console.error("Dashboard element not found!");
      return;
    }

    try {
      // Capture the element as an image
      const canvas = await html2canvas(element, {
        useCORS: true, // Ensures cross-origin charts (e.g., Nivo) are captured
        allowTaint: true,
        scrollY: -window.scrollY, // Capture the entire viewport even when scrolled
      });

      const imgData = canvas.toDataURL("image/png"); // Convert to image data
      const pdf = new jsPDF("p", "mm", "a4"); // Initialize jsPDF

      // Scale the canvas to fit the A4 size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Download the PDF
      pdf.save("dashboard-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Box flex="1" textAlign="right">
      <Button
        onClick={handleDownload}
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "16px",
          fontWeight: "bold",
          padding: "20px 30px",
        }}
      >
        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
        Download Reports
      </Button>
    </Box>
  );
};

export default DownloadButton;
