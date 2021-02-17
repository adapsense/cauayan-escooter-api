const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleMessageSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
        topic: { type: String, default: null },
        payload: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "VehicleMessage",
    VehicleMessageSchema,
    "vehicleMessages"
);
