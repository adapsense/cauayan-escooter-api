const VehicleLog = require("../models/VehicleLog");

exports.getVehicleLogs = async (req, res) => {
    const { vehicleLog } = req.body;

    VehicleLog.find(vehicleLog).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, vehicleLogs: data });
    });
};

exports.getVehicleLog = async (req, res) => {

    const { vehicles, vehicle } = req.body;

    if (!vehicles && !vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    if(vehicles) {
        var vehicleLogs = {};
        var count = 0;
        vehicles.forEach(vehicle => {
            VehicleLog.findOne({ vehicle: vehicle._id })
                .sort({ time: -1 })
                .populate({
                    path: "vehicle",
                    model: "Vehicle",
                    select: "_id name label topic"
                })
                .exec(function (err, data) {
                    if (err)
                        return res.status(500).json({
                            success: false,
                            error: err,
                        });
                    if(data != null) {
                        vehicleLogs[vehicle._id] = data;
                    }
                    count++;
                    if (count == vehicles.length) {
                        return res
                            .status(200)
                            .json({ success: true, vehicleLogs: vehicleLogs });
                    }
                });
        });
    } else {
        VehicleLog.findOne({ vehicle: vehicle._id })
            .sort({ time: -1 })
            .populate({
                path: "vehicle",
                model: "Vehicle",
                select: "_id name label topic",
            })
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                return res
                    .status(200)
                    .json({ success: true, vehicleLog: data });
            });
    }

};

exports.addVehicleLog = async (req, res) => {
    const { vehicleLog } = req.body;

    if (!vehicleLog) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLog(vehicleLog).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, vehicleLog: data });
    });
};

exports.updateVehicleLog = async (req, res) => {
    const { vehicleLog } = req.body;

    if (!vehicleLog) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLog.findByIdAndUpdate(
        vehicleLog._id,
        vehicleLog,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, vehicleLog: data });
        }
    );
};

exports.deleteVehicleLog = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLog.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
