const express = require("express");
const vehicleMessageRouter = express.Router();
const vehicleMessageController = require("../controllers/vehicleMessageController");

module.exports = vehicleMessageRouter;

vehicleMessageRouter.get("/", vehicleMessageController.getVehicleMessages);

vehicleMessageRouter.post("/", vehicleMessageController.getVehicleMessages);

vehicleMessageRouter.put("/", vehicleMessageController.addVehicleMessage);

vehicleMessageRouter.patch("/", vehicleMessageController.updateVehicleMessage);

vehicleMessageRouter.delete("/", vehicleMessageController.deleteVehicleMessage);
