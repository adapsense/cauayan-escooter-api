const mongoose = require("mongoose");
require("mongoose-geojson-schema");
const Schema = mongoose.Schema;

const TripSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        unlockTime: { type: Date, default: Date.now },
        lockTime: { type: Date, default: null },
        startLocation: { type: mongoose.Schema.Types.Point, default: null },
        endLocation: { type: mongoose.Schema.Types.Point, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Trip", TripSchema);
