const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleLeaseSchema = new Schema(
    {
        rider: { type: Schema.Types.ObjectId, ref: "User" },
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("VehicleLease", VehicleLeaseSchema, "vehicleLeases");
