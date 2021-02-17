const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleStatusSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        isAvailable: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "VehicleStatus",
    VehicleStatusSchema,
    "vehicleStatuses"
);
