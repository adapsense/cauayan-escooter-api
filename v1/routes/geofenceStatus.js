const express = require("express");
const geofenceStatusRouter = express.Router();
const geofenceStatusController = require("../controllers/geofenceStatusController");

module.exports = geofenceStatusRouter;

geofenceStatusRouter.get("/", geofenceStatusController.getGeofenceStatuses);

geofenceStatusRouter.post("/", geofenceStatusController.getGeofenceStatuses);

geofenceStatusRouter.put("/", geofenceStatusController.addGeofenceStatus);

geofenceStatusRouter.patch("/", geofenceStatusController.updateGeofenceStatus);

geofenceStatusRouter.delete("/", geofenceStatusController.deleteGeofenceStatus);
