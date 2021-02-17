const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Temperature
//Humidity
//IAQ
//Pressure
//Altitude
//Scooter Usage
//Scooter Route
//Scooter Lease History
//Rider Lease History
//App Usage

const AnalyticsTypeSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        url: { type: String, default: "" },
        isUser: { type: Boolean, default: false },
        isVehicle: { type: Boolean, default: false },
        isTrip: { type: Boolean, default: false },
        isDate: { type: Boolean, default: false },
        isTime: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AnalyticsType",
    AnalyticsTypeSchema,
    "analyticsTypes"
);
