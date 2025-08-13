import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const PIE_COLORS = ["#4CAF50", "#FF5722"];
const BAR_COLOR = "#2196F3";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/simulations/history");
        if (res.data && res.data.length) setData(res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">
          No simulation yet. Run the simulation page.
        </Typography>
      </Box>
    );
  }

  const pie = [
    { name: "On-time", value: data.onTimeDeliveries },
    { name: "Late", value: data.lateDeliveries },
  ];

  const fuel = Object.keys(data.fuelCostBreakdown || {}).map((k) => ({
    name: k,
    value: data.fuelCostBreakdown[k] || 0,
  }));

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3, maxWidth: "800px" }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#E3F2FD" }}>
            <CardContent>
              <Typography variant="subtitle1">Total Profit</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{data.totalProfit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#E8F5E9" }}>
            <CardContent>
              <Typography variant="subtitle1">Efficiency</Typography>
              <Typography variant="h5" fontWeight="bold">
                {data.efficiencyScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ maxWidth: "900px" }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                On-time vs Late Deliveries
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pie} dataKey="value" outerRadius={100} label>
                    {pie.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fuel Cost Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fuel}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={BAR_COLOR} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
