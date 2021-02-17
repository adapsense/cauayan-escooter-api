const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleLogSchema = new Schema(
    {
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
        time: { type: String },
        lat: { type: Number },
        long: { type: Number },
        lockStatus: { type: String },
        message: { type: String },
        closing: { type: Boolean },
        temperature: { type: String },
        iaq: { type: String },
        humidity: { type: String },
        pressure: { type: String },
        altitude: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "VehicleLog",
    VehicleLogSchema,
    "vehicleLogs"
);
