const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeofenceStatusSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        isActive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "GeofenceStatus",
    GeofenceStatusSchema,
    "geofenceStatuses"
);
