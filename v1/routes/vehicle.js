const express = require("express");
const vehicleRouter = express.Router();
const vehicleController = require("../controllers/vehicleController");
const moment = require("moment");
const multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

if (process.env.ENV == "dev") {
    upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./public/uploads/vehicles");
            },
            filename: (req, file, cb) => {
                var { vehicle } = req.body;
                if (vehicle) {
                    vehicle = JSON.parse(vehicle);
                    var filename =
                        moment().format("YYYYMMDD_hhmmss") +
                        "_" +
                        vehicle._id +
                        "_" +
                        file.originalname;
                    cb(null, filename);
                }
            },
        }),
    });
}

module.exports = vehicleRouter;

vehicleRouter.get("/", vehicleController.getVehicles);

vehicleRouter.get("/search", vehicleController.getVehicles);

vehicleRouter.post("/", vehicleController.getVehicles);

vehicleRouter.put(
    "/",
    upload.single("image"),
    vehicleController.addVehicle
);

vehicleRouter.patch(
    "/",
    upload.single("image"),
    vehicleController.updateVehicle
);

vehicleRouter.delete("/", vehicleController.deleteVehicle);
