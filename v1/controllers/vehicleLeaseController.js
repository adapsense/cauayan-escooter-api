const VehicleLease = require("../models/VehicleLease");

exports.getVehicleLeases = async (req, res) => {

    var count = parseInt(req.query.count);
    if (!count || count > 30) {
        count = 30;
    }

    const { vehicleLease } = req.body;

    VehicleLease.find(vehicleLease)
        .sort({ createdAt: -1 })
        .limit(count)
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            return res.status(200).json({ success: true, vehicleLeases: data });
        });
};

exports.addVehicleLease = async (req, res) => {
    const { vehicleLease } = req.body;

    if (!vehicleLease) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLease(vehicleLease).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, vehicleLease: data });
    });
};

exports.updateVehicleLease = async (req, res) => {
    const { vehicleLease } = req.body;

    if (!vehicleLease) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLease.findByIdAndUpdate(
        vehicleLease._id,
        vehicleLease,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, vehicleLease: data });
        }
    );
};

exports.deleteVehicleLease = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleLease.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
