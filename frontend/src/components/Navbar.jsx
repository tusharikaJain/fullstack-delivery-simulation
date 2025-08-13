// frontend/src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios"; // ✅ Make sure to import API

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"]; // ✅ Remove the header completely
    navigate("/login", { replace: true }); // ✅ Replace history to avoid going back
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #4CAF50, #2E7D32)",
        boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          GreenCart Logistics
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button component={Link} to="/dashboard" color="inherit" sx={{ mx: 1 }}>
            Dashboard
          </Button>
          <Button component={Link} to="/simulation" color="inherit" sx={{ mx: 1 }}>
            Simulation
          </Button>
          <Button component={Link} to="/management" color="inherit" sx={{ mx: 1 }}>
            Management
          </Button>
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              ml: 2,
              color: "#fff",
              borderColor: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
