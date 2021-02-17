const moment = require("moment");
const Vehicle = require("../models/Vehicle");
const VehicleLog = require("../models/VehicleLog");
const Trip = require("../models/Trip");

exports.getTemperature = async (req, res) => {
    const { date, vehicle } = req.body;

    if(!date || !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Vehicle.findById(vehicle._id)
        .select("_id name")
        .exec((vehicleFindErr, vehicleFindData) => {
            if (vehicleFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleFindErr });
            VehicleLog.find({
                time: {
                    $gte: date + " 00:00:00",
                    $lte: date + " 23:59:59",
                },
                vehicle: vehicle._id,
            })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var time = [];
                    var vehicleLogs = [];
                    var unit = "C";
                    data.forEach((vehicleLog) => {
                        time.push(
                            moment(
                                vehicleLog.time,
                                "yyyy-MM-dd HH:mm:ss"
                            ).format("h:mm a").toUpperCase()
                        );
                        vehicleLogs.push(vehicleLog.temperature.split(" ")[0]);
                        unit = vehicleLog.temperature.split(" ")[1];
                    });
                    return res.status(200).json({
                        success: true,
                        vehicle: vehicleFindData,
                        date: date,
                        unit: unit,
                        time: time,
                        vehicleLogs: vehicleLogs,
                    });
                });
        });

};

exports.getHumidity = async (req, res) => {
    const { date, vehicle } = req.body;

    if (!date || !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Vehicle.findById(vehicle._id)
        .select("_id name")
        .exec((vehicleFindErr, vehicleFindData) => {
            if (vehicleFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleFindErr });
            VehicleLog.find({
                time: {
                    $gte: date + " 00:00:00",
                    $lte: date + " 23:59:59",
                },
                vehicle: vehicle._id,
            })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var time = [];
                    var vehicleLogs = [];
                    var unit = "%";
                    data.forEach((vehicleLog) => {
                        time.push(
                            moment(vehicleLog.time, "yyyy-MM-dd HH:mm:ss")
                                .format("h:mm a")
                                .toUpperCase()
                        );
                        vehicleLogs.push(vehicleLog.humidity.split(" ")[0]);
                        unit = vehicleLog.humidity.split(" ")[1];
                    });
                    return res.status(200).json({
                        success: true,
                        vehicle: vehicleFindData,
                        date: date,
                        unit: unit,
                        time: time,
                        vehicleLogs: vehicleLogs,
                    });
                });
        });
};

exports.getIaq = async (req, res) => {
    const { date, vehicle } = req.body;

    if (!date || !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Vehicle.findById(vehicle._id)
        .select("_id name")
        .exec((vehicleFindErr, vehicleFindData) => {
            if (vehicleFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleFindErr });
            VehicleLog.find({
                time: {
                    $gte: date + " 00:00:00",
                    $lte: date + " 23:59:59",
                },
                vehicle: vehicle._id,
            })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var time = [];
                    var vehicleLogs = [];
                    var unit = "";
                    data.forEach((vehicleLog) => {
                        time.push(
                            moment(vehicleLog.time, "yyyy-MM-dd HH:mm:ss")
                                .format("h:mm a")
                                .toUpperCase()
                        );
                        vehicleLogs.push(vehicleLog.iaq.trim());
                    });
                    return res.status(200).json({
                        success: true,
                        vehicle: vehicleFindData,
                        date: date,
                        unit: unit,
                        time: time,
                        vehicleLogs: vehicleLogs,
                    });
                });
        });
};

exports.getPressure = async (req, res) => {
    const { date, vehicle } = req.body;

    if (!date || !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Vehicle.findById(vehicle._id)
        .select("_id name")
        .exec((vehicleFindErr, vehicleFindData) => {
            if (vehicleFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleFindErr });
            VehicleLog.find({
                time: {
                    $gte: date + " 00:00:00",
                    $lte: date + " 23:59:59",
                },
                vehicle: vehicle._id,
            })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var time = [];
                    var vehicleLogs = [];
                    var unit = "hPa";
                    data.forEach((vehicleLog) => {
                        time.push(
                            moment(vehicleLog.time, "yyyy-MM-dd HH:mm:ss")
                                .format("h:mm a")
                                .toUpperCase()
                        );
                        vehicleLogs.push(vehicleLog.pressure.split(" ")[0]);
                        unit = vehicleLog.pressure.split(" ")[1];
                    });
                    return res.status(200).json({
                        success: true,
                        vehicle: vehicleFindData,
                        date: date,
                        unit: unit,
                        time: time,
                        vehicleLogs: vehicleLogs,
                    });
                });
        });
};

exports.getAltitude = async (req, res) => {
    const { date, vehicle } = req.body;

    if (!date || !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Vehicle.findById(vehicle._id)
        .select("_id name")
        .exec((vehicleFindErr, vehicleFindData) => {
            if (vehicleFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleFindErr });
            VehicleLog.find({
                time: {
                    $gte: date + " 00:00:00",
                    $lte: date + " 23:59:59",
                },
                vehicle: vehicle._id,
            })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var time = [];
                    var vehicleLogs = [];
                    var unit = "meters";
                    data.forEach((vehicleLog) => {
                        time.push(
                            moment(vehicleLog.time, "yyyy-MM-dd HH:mm:ss")
                                .format("h:mm a")
                                .toUpperCase()
                        );
                        vehicleLogs.push(vehicleLog.altitude.split(" ")[0]);
                        unit = vehicleLog.altitude.split(" ")[1];
                    });
                    return res.status(200).json({
                        success: true,
                        vehicle: vehicleFindData,
                        date: date,
                        unit: unit,
                        time: time,
                        vehicleLogs: vehicleLogs,
                    });
                });
        });
};

exports.getTrip = async (req, res) => {

    const { trip } = req.body;

    if (!trip) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Trip.findById(trip._id)
        .populate({
            path: "user",
            model: "Vehicle",
            select: "_id fullName email",
        })
        .populate({
            path: "vehicle",
            model: "Vehicle",
            select: "_id name label",
        })
        .exec((tripFindErr, tripFindData) => {
            if (tripFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: tripFindErr });
            VehicleLog.find({
                    time: {
                        $gte: moment(tripFindData.unlockTime).format("YYYY-MM-DD HH:mm:ss"),
                        $lte: moment(tripFindData.lockTime).format("YYYY-MM-DD HH:mm:ss"),
                    },
                    vehicle: tripFindData.vehicle._id,
                })
                .sort({ time: 1 })
                .lean()
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    var coordinates = [];
                    data.forEach((vehicleLog) => {
                        coordinates.push([parseFloat(vehicleLog.lat), parseFloat(vehicleLog.long)]);
                    });
                    return res.status(200).json({
                        success: true,
                        trip: tripFindData,
                        route: coordinates
                    });
                });
        });
};