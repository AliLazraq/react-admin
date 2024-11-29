import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      await axios.post(`http://localhost:8080/api/v1/customer/add`, formData);
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please check your details.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundImage: 'url("/assets/BG.png")', // High-quality image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Optional for parallax effect
      }}
      padding={3}
    >
      <Box
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background
          padding: 5,
          borderRadius: 3,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
          width: { xs: 300, sm: 400 }, // Responsive size
          textAlign: "center", // Center-align text inside the box
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Please fill in the form below to create an account.
        </Typography>
        <TextField
          fullWidth
          label="First Name"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRegister}
          sx={{
            marginTop: 2,
            padding: 1.5,
            borderRadius: 3, // Rounded corners
            fontSize: "1rem",
          }}
        >
          Register
        </Button>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: 2 }}
        >
          Already have an account?{" "}
          <Link
            onClick={() => navigate("/login")}
            underline="hover"
            sx={{ cursor: "pointer", fontWeight: "bold", color: "primary.main" }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
