const mongoose = require("mongoose");
require("mongoose-geojson-schema");
const Schema = mongoose.Schema;

const GeofenceSchema = new Schema(
    {
        geofenceStatus: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "GeofenceStatus",
        },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
        polygon: { type: mongoose.Schema.Types.Polygon, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Geofence", GeofenceSchema);
