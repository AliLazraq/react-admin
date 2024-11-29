import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthorizationToken } from "../../api/axiosInstance";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        `/customer/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      const token = response.data; // JWT token returned by the backend
      console.log("User logged in successfully. Token:", token);

      localStorage.setItem("authToken", token);

      setAuthorizationToken(token);
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";
      console.error("Login error:", errorMessage);
      alert(errorMessage);
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
          Welcome!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Please enter your credentials to log in.
        </Typography>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{
            marginTop: 2,
            padding: 1.5,
            borderRadius: 3, // Rounded corners
            fontSize: "1rem",
          }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: 2 }}
        >
          Don't have an account?{" "}
          <Link
            onClick={() => navigate("/register")}
            underline="hover"
            sx={{ cursor: "pointer", fontWeight: "bold", color: "primary.main" }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
