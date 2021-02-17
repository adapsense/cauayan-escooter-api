const express = require("express");
const analyticsRouter = express.Router();
const analyticsController = require("../controllers/analyticsController");

module.exports = analyticsRouter;

analyticsRouter.post("/vehicleLogs/temperature", analyticsController.getTemperature);

analyticsRouter.post(
    "/vehicleLogs/humidity",
    analyticsController.getHumidity
);

analyticsRouter.post("/vehicleLogs/iaq", analyticsController.getIaq);

analyticsRouter.post("/vehicleLogs/pressure", analyticsController.getPressure);

analyticsRouter.post("/vehicleLogs/altitude", analyticsController.getAltitude);

analyticsRouter.post("/trips", analyticsController.getTrip);
