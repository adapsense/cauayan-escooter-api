const express = require("express");
const vehicleLeaseRouter = express.Router();
const vehicleLeaseController = require("../controllers/vehicleLeaseController");

module.exports = vehicleLeaseRouter;

vehicleLeaseRouter.get("/", vehicleLeaseController.getVehicleLeases);

vehicleLeaseRouter.post("/", vehicleLeaseController.getVehicleLeases);

vehicleLeaseRouter.put("/", vehicleLeaseController.addVehicleLease);

vehicleLeaseRouter.patch("/", vehicleLeaseController.updateVehicleLease);

vehicleLeaseRouter.delete("/", vehicleLeaseController.deleteVehicleLease);
