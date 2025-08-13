// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Management from "./pages/Management";
import Navbar from "./components/Navbar";

// ✅ Private Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <PrivateRoute>
              <Navbar />
              <Simulation />
            </PrivateRoute>
          }
        />
        <Route
          path="/management"
          element={
            <PrivateRoute>
              <Navbar />
              <Management />
            </PrivateRoute>
          }
        />

        {/* Redirect root to dashboard if logged in */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}
