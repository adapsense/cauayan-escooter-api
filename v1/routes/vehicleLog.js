const express = require("express");
const vehicleLogRouter = express.Router();
const vehicleLogController = require("../controllers/vehicleLogController");

module.exports = vehicleLogRouter;

vehicleLogRouter.get("/", vehicleLogController.getVehicleLogs);

vehicleLogRouter.post("/", vehicleLogController.getVehicleLogs);

vehicleLogRouter.post("/latest", vehicleLogController.getVehicleLog);

vehicleLogRouter.put("/", vehicleLogController.addVehicleLog);

vehicleLogRouter.patch("/", vehicleLogController.updateVehicleLog);

vehicleLogRouter.delete("/", vehicleLogController.deleteVehicleLog);
