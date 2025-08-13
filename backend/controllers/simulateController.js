const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');
const SimulationResult = require('../models/SimulationResult');

/**
 * Helper: round-robin allocation of orders to drivers (simple, deterministic)
 */
function allocateOrdersToDrivers(orders, drivers) {
  const allocation = {};
  const nDrivers = drivers.length;
  if (nDrivers === 0) return allocation;
  for (let i = 0; i < orders.length; i++) {
    const driverIdx = i % nDrivers;
    const driverId = drivers[driverIdx]._id.toString();
    allocation[orders[i]._id] = driverId;
  }
  return allocation;
}

/**
 * POST /api/simulate
 * body: { availableDrivers, startTime: "HH:MM", maxHoursPerDriver }
 */
exports.runSimulation = async (req, res) => {
  try {
    const { availableDrivers, startTime, maxHoursPerDriver } = req.body;

    // validation
    if (availableDrivers == null || startTime == null || maxHoursPerDriver == null) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    if (availableDrivers <= 0) return res.status(400).json({ error: 'availableDrivers must be > 0' });
    if (maxHoursPerDriver <= 0) return res.status(400).json({ error: 'maxHoursPerDriver must be > 0' });

    // fetch data
    let drivers = await Driver.find().lean();
    const routes = await Route.find().lean();
    const orders = await Order.find().lean();

    if (availableDrivers > drivers.length) {
      return res.status(400).json({ error: 'availableDrivers exceeds total drivers in DB' });
    }

    // pick first availableDrivers (simplest)
    drivers = drivers.slice(0, availableDrivers);

    // allocate orders to drivers (round-robin)
    const allocation = allocateOrdersToDrivers(orders, drivers);

    // prepare helper maps for routes
    const routeMap = {};
    routes.forEach(r => routeMap[r.routeId] = r);

    // company rules constants
    const LATE_PENALTY = 50; // ₹50 per late order
    const HIGH_VALUE_THRESHOLD = 1000;
    const HIGH_VALUE_BONUS_RATE = 0.10; // 10% of order value
    const BASE_FUEL_PER_KM = 5; // ₹5/km
    const TRAFFIC_SURCHARGE = 2; // +₹2/km when High
    const FATIGUE_THRESHOLD_HOURS = 8;
    const FATIGUE_SPEED_MULTIPLIER = 0.7; // decrease by 30% => speed becomes 70%

    let totalProfit = 0;
    let onTime = 0;
    let late = 0;
    let totalFuelCosts = 0;
    const fuelCostBreakdown = { Low: 0, Medium: 0, High: 0 };
    const details = [];

    // For each order, compute actual delivery time and profit
    for (const order of orders) {
      const route = routeMap[order.assignedRoute];
      if (!route) {
        // skip if route missing
        continue;
      }

      // find allocated driver
      const driverId = allocation[order._id];
      const driver = drivers.find(d => d._id.toString() === driverId);

      // base route time (minutes)
      const baseTime = route.baseTimeMinutes;

      // determine if driver is fatigued: check last day (pastWeekHours last element)
      let fatigued = false;
      if (driver && Array.isArray(driver.pastWeekHours) && driver.pastWeekHours.length > 0) {
        const lastDayHours = driver.pastWeekHours[driver.pastWeekHours.length - 1];
        if (lastDayHours > FATIGUE_THRESHOLD_HOURS) fatigued = true;
      }

      // compute speed multiplier
      const speedMultiplier = fatigued ? FATIGUE_SPEED_MULTIPLIER : 1.0;
      // actual delivery time in minutes = baseTime / speedMultiplier
      const actualDeliveryTime = baseTime / speedMultiplier;

      // late if actualDeliveryTime > baseTime + 10
      const isLate = actualDeliveryTime > (baseTime + 10);

      // fuel cost
      let perKm = BASE_FUEL_PER_KM + (route.trafficLevel === 'High' ? TRAFFIC_SURCHARGE : 0);
      const fuelCost = perKm * route.distanceKm;

      // penalty
      const penalty = isLate ? LATE_PENALTY : 0;

      // bonus
      let bonus = 0;
      if (!isLate && order.valueRs > HIGH_VALUE_THRESHOLD) {
        bonus = order.valueRs * HIGH_VALUE_BONUS_RATE;
      }

      // profit contribution = order value + bonus - penalty - fuelCost
      const profitContribution = order.valueRs + bonus - penalty - fuelCost;

      totalProfit += profitContribution;
      totalFuelCosts += fuelCost;
      fuelCostBreakdown[route.trafficLevel] = (fuelCostBreakdown[route.trafficLevel] || 0) + fuelCost;

      if (isLate) late += 1;
      else onTime += 1;

      // record detail
      details.push({
        orderId: order.orderId,
        assignedDriver: driver ? driver.name : null,
        routeId: route.routeId,
        baseTimeMinutes: baseTime,
        actualDeliveryTimeMinutes: actualDeliveryTime,
        isLate,
        penalty,
        bonus,
        fuelCost,
        profitContribution
      });
    }

    const totalDeliveries = onTime + late;
    const efficiencyScore = totalDeliveries === 0 ? 0 : (onTime / totalDeliveries) * 100;

    // Round numeric results sensibly
    const result = {
      timestamp: new Date(),
      inputs: { availableDrivers, startTime, maxHoursPerDriver },
      totalProfit: Number(totalProfit.toFixed(2)),
      efficiencyScore: Number(efficiencyScore.toFixed(2)),
      onTimeDeliveries: onTime,
      lateDeliveries: late,
      totalDeliveries,
      fuelCostBreakdown,
      details
    };

    // save to DB
    const sim = new SimulationResult(result);
    await sim.save();

    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
