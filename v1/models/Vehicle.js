const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new Schema(
    {
        admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rider: { type: Schema.Types.ObjectId, ref: "User", default: null },
        vehicleType: {
            type: Schema.Types.ObjectId,
            ref: "VehicleType",
            required: true,
        },
        vehicleStatus: {
            type: Schema.Types.ObjectId,
            ref: "VehicleStatus",
            required: true,
        },
        name: { type: String, unique: true, required: true },
        description: { type: String, default: "" },
        topic: { type: String, default: "" },
        label: { type: String, default: "" },
        code: { type: String, default: "" },
        qr: { type: String, default: "" },
        serialNumber: { type: String, default: "" },
        brand: { type: String, default: "" },
        model: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
