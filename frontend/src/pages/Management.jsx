// frontend/src/pages/Management.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Management() {
  const [tab, setTab] = useState(0); // 0=Drivers, 1=Routes, 2=Orders
  const [message, setMessage] = useState('');

  const [drivers, setDrivers] = useState([]);
  const [driverForm, setDriverForm] = useState({ name: '', currentShiftHours: 0, pastWeekHours: '' });
  const [driverEditId, setDriverEditId] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [routeForm, setRouteForm] = useState({ routeId: '', distanceKm: 0, trafficLevel: 'Low', baseTimeMinutes: 0 });
  const [routeEditId, setRouteEditId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({ orderId: '', valueRs: 0, assignedRoute: '', deliveryMinutes: '' });
  const [orderEditId, setOrderEditId] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    await Promise.all([fetchDrivers(), fetchRoutes(), fetchOrders()]);
  }

  // DRIVERS
  async function fetchDrivers() { setDrivers((await API.get('/drivers')).data || []); }
  async function saveDriver(e) {
    e.preventDefault();
    const pastHours = driverForm.pastWeekHours.split(',').map(s => Number(s.trim())).filter(Boolean);
    if (driverEditId) {
      await API.put(`/drivers/${driverEditId}`, { ...driverForm, currentShiftHours: Number(driverForm.currentShiftHours), pastWeekHours: pastHours });
    } else {
      await API.post('/drivers', { ...driverForm, currentShiftHours: Number(driverForm.currentShiftHours), pastWeekHours: pastHours });
    }
    resetDriverForm(); fetchDrivers();
  }
  function resetDriverForm() { setDriverForm({ name: '', currentShiftHours: 0, pastWeekHours: '' }); setDriverEditId(null); }
  function editDriver(d) { setDriverEditId(d._id); setDriverForm({ name: d.name, currentShiftHours: d.currentShiftHours, pastWeekHours: (d.pastWeekHours||[]).join(',') }); }
  async function deleteDriver(id) { if (!window.confirm('Delete driver?')) return; await API.delete(`/drivers/${id}`); fetchDrivers(); }

  // ROUTES
  async function fetchRoutes() { setRoutes((await API.get('/routes')).data || []); }
  async function saveRoute(e) {
    e.preventDefault();
    if (routeEditId) {
      await API.put(`/routes/${routeEditId}`, { ...routeForm, distanceKm: Number(routeForm.distanceKm), baseTimeMinutes: Number(routeForm.baseTimeMinutes) });
    } else {
      await API.post('/routes', { ...routeForm, distanceKm: Number(routeForm.distanceKm), baseTimeMinutes: Number(routeForm.baseTimeMinutes) });
    }
    resetRouteForm(); fetchRoutes();
  }
  function resetRouteForm() { setRouteForm({ routeId: '', distanceKm: 0, trafficLevel: 'Low', baseTimeMinutes: 0 }); setRouteEditId(null); }
  function editRoute(r) { setRouteEditId(r._id); setRouteForm(r); }
  async function deleteRoute(id) { if (!window.confirm('Delete route?')) return; await API.delete(`/routes/${id}`); fetchRoutes(); }

  // ORDERS
  async function fetchOrders() { setOrders((await API.get('/orders')).data || []); }
  async function saveOrder(e) {
    e.preventDefault();
    if (orderEditId) {
      await API.put(`/orders/${orderEditId}`, { ...orderForm, valueRs: Number(orderForm.valueRs), deliveryMinutes: orderForm.deliveryMinutes ? Number(orderForm.deliveryMinutes) : undefined });
    } else {
      await API.post('/orders', { ...orderForm, valueRs: Number(orderForm.valueRs), deliveryMinutes: orderForm.deliveryMinutes ? Number(orderForm.deliveryMinutes) : undefined });
    }
    resetOrderForm(); fetchOrders();
  }
  function resetOrderForm() { setOrderForm({ orderId: '', valueRs: 0, assignedRoute: '', deliveryMinutes: '' }); setOrderEditId(null); }
  function editOrder(o) { setOrderEditId(o._id); setOrderForm(o); }
  async function deleteOrder(id) { if (!window.confirm('Delete order?')) return; await API.delete(`/orders/${id}`); fetchOrders(); }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Management</Typography>
      {message && <Typography color="primary">{message}</Typography>}

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 2 }}>
        <Tab label="Drivers" />
        <Tab label="Routes" />
        <Tab label="Orders" />
      </Tabs>

      {/* DRIVERS */}
      {tab === 0 && (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Current Shift Hours</TableCell>
                  <TableCell>Past Week Hours</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.map(d => (
                  <TableRow key={d._id}>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.currentShiftHours}</TableCell>
                    <TableCell>{(d.pastWeekHours||[]).join(', ')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editDriver(d)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteDriver(d._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <form onSubmit={saveDriver}>
            <TextField label="Name" value={driverForm.name} onChange={e=>setDriverForm({...driverForm, name:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Current Shift Hours" type="number" value={driverForm.currentShiftHours} onChange={e=>setDriverForm({...driverForm, currentShiftHours:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Past Week Hours (comma)" value={driverForm.pastWeekHours} onChange={e=>setDriverForm({...driverForm, pastWeekHours:e.target.value})} sx={{ mr: 1 }} />
            <Button variant="contained" type="submit">{driverEditId ? 'Update' : 'Add'}</Button>
            <Button onClick={resetDriverForm} sx={{ ml: 1 }}>Cancel</Button>
          </form>
        </>
      )}

      {/* ROUTES */}
      {tab === 1 && (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route ID</TableCell>
                  <TableCell>Distance (km)</TableCell>
                  <TableCell>Traffic</TableCell>
                  <TableCell>Base Time (min)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map(r => (
                  <TableRow key={r._id}>
                    <TableCell>{r.routeId}</TableCell>
                    <TableCell>{r.distanceKm}</TableCell>
                    <TableCell>{r.trafficLevel}</TableCell>
                    <TableCell>{r.baseTimeMinutes}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editRoute(r)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteRoute(r._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <form onSubmit={saveRoute}>
            <TextField label="Route ID" value={routeForm.routeId} onChange={e=>setRouteForm({...routeForm, routeId:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Distance" type="number" value={routeForm.distanceKm} onChange={e=>setRouteForm({...routeForm, distanceKm:e.target.value})} sx={{ mr: 1 }} />
            <Select value={routeForm.trafficLevel} onChange={e=>setRouteForm({...routeForm, trafficLevel:e.target.value})} sx={{ mr: 1 }}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
            <TextField label="Base Time (min)" type="number" value={routeForm.baseTimeMinutes} onChange={e=>setRouteForm({...routeForm, baseTimeMinutes:e.target.value})} sx={{ mr: 1 }} />
            <Button variant="contained" type="submit">{routeEditId ? 'Update' : 'Add'}</Button>
            <Button onClick={resetRouteForm} sx={{ ml: 1 }}>Cancel</Button>
          </form>
        </>
      )}

      {/* ORDERS */}
      {tab === 2 && (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Value (₹)</TableCell>
                  <TableCell>Assigned Route</TableCell>
                  <TableCell>Delivery Minutes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o._id}>
                    <TableCell>{o.orderId}</TableCell>
                    <TableCell>{o.valueRs}</TableCell>
                    <TableCell>{o.assignedRoute}</TableCell>
                    <TableCell>{o.deliveryMinutes || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editOrder(o)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteOrder(o._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <form onSubmit={saveOrder}>
            <TextField label="Order ID" value={orderForm.orderId} onChange={e=>setOrderForm({...orderForm, orderId:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Value ₹" type="number" value={orderForm.valueRs} onChange={e=>setOrderForm({...orderForm, valueRs:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Assigned Route" value={orderForm.assignedRoute} onChange={e=>setOrderForm({...orderForm, assignedRoute:e.target.value})} sx={{ mr: 1 }} />
            <TextField label="Delivery Minutes" type="number" value={orderForm.deliveryMinutes} onChange={e=>setOrderForm({...orderForm, deliveryMinutes:e.target.value})} sx={{ mr: 1 }} />
            <Button variant="contained" type="submit">{orderEditId ? 'Update' : 'Add'}</Button>
            <Button onClick={resetOrderForm} sx={{ ml: 1 }}>Cancel</Button>
          </form>
        </>
      )}
    </Box>
  );
}
