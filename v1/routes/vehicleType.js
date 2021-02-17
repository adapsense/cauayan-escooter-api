const express = require("express");
const vehicleTypeRouter = express.Router();
const vehicleTypeController = require("../controllers/vehicleTypeController");

module.exports = vehicleTypeRouter;

vehicleTypeRouter.get("/", vehicleTypeController.getVehicleTypes);

vehicleTypeRouter.post("/", vehicleTypeController.getVehicleTypes);

vehicleTypeRouter.put("/", vehicleTypeController.addVehicleType);

vehicleTypeRouter.patch("/", vehicleTypeController.updateVehicleType);

vehicleTypeRouter.delete("/", vehicleTypeController.deleteVehicleType);
