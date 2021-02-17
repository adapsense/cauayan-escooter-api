const VehicleStatus = require("../models/VehicleStatus");

exports.getVehicleStatuses = async (req, res) => {
    const { vehicleStatus } = req.body;

    VehicleStatus.find(vehicleStatus).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, vehicleStatuses: data });
    });
};

exports.addVehicleStatus = async (req, res) => {
    const { vehicleStatus } = req.body;

    if (!vehicleStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleStatus(vehicleStatus).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, vehicleStatus: data });
    });
};

exports.updateVehicleStatus = async (req, res) => {
    const { vehicleStatus } = req.body;

    if (!vehicleStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleStatus.findByIdAndUpdate(
        vehicleStatus._id,
        vehicleStatus,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, vehicleStatus: data });
        }
    );
};

exports.deleteVehicleStatus = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleStatus.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
