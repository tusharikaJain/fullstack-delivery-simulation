// frontend/src/pages/Simulation.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import API from "../api/axios";

export default function Simulation() {
  const [availableDrivers, setAvailableDrivers] = useState(3);
  const [startTime, setStartTime] = useState("09:00");
  const [maxHours, setMaxHours] = useState(8);
  const [result, setResult] = useState(null);

  const run = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/simulation/run",
        {
          availableDrivers: Number(availableDrivers),
          startTime,
          maxHoursPerDriver: Number(maxHours),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)", // subtract navbar height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Run Simulation
        </Typography>

        <TextField
          label="Available Drivers"
          type="number"
          fullWidth
          value={availableDrivers}
          onChange={(e) => setAvailableDrivers(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Start Time"
          type="time"
          fullWidth
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Max Hours / Driver"
          type="number"
          fullWidth
          value={maxHours}
          onChange={(e) => setMaxHours(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={run}
          sx={{ mb: 3 }}
        >
          Run Simulation
        </Button>

        {result && (
          <Box
            sx={{
              textAlign: "left",
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              background: "#fff",
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
