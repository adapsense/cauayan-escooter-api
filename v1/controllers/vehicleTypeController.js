const VehicleType = require("../models/VehicleType");

exports.getVehicleTypes = async (req, res) => {
    const { vehicleType } = req.body;

    VehicleType.find(vehicleType).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, vehicleTypes: data });
    });
};

exports.addVehicleType = async (req, res) => {
    const { vehicleType } = req.body;

    if (!vehicleType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleType(vehicleType).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, vehicleType: data });
    });
};

exports.updateVehicleType = async (req, res) => {
    const { vehicleType } = req.body;

    if (!vehicleType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleType.findByIdAndUpdate(
        vehicleType._id,
        vehicleType,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, vehicleType: data });
        }
    );
};

exports.deleteVehicleType = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleType.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
