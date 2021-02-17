const express = require("express");
const tripRouter = express.Router();
const tripController = require("../controllers/tripController");

module.exports = tripRouter;

tripRouter.get("/", tripController.getTrips);

tripRouter.post("/", tripController.getTrips);

tripRouter.put("/", tripController.addTrip);

tripRouter.patch("/", tripController.updateTrip);

tripRouter.delete("/", tripController.deleteTrip);
