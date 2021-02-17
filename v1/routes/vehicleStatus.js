const express = require("express");
const vehicleStatusRouter = express.Router();
const vehicleStatusController = require("../controllers/vehicleStatusController");

module.exports = vehicleStatusRouter;

vehicleStatusRouter.get("/", vehicleStatusController.getVehicleStatuses);

vehicleStatusRouter.post("/", vehicleStatusController.getVehicleStatuses);

vehicleStatusRouter.put("/", vehicleStatusController.addVehicleStatus);

vehicleStatusRouter.patch("/", vehicleStatusController.updateVehicleStatus);

vehicleStatusRouter.delete("/", vehicleStatusController.deleteVehicleStatus);
