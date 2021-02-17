const express = require("express");
const geofenceRouter = express.Router();
const geofenceController = require("../controllers/geofenceController");

module.exports = geofenceRouter;

geofenceRouter.get("/", geofenceController.getGeofences);

geofenceRouter.post("/", geofenceController.getGeofences);

geofenceRouter.put("/", geofenceController.addGeofence);

geofenceRouter.patch("/", geofenceController.updateGeofence);

geofenceRouter.delete("/", geofenceController.deleteGeofence);
