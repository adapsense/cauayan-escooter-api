const VehicleMessage = require("../models/VehicleMessage");

exports.getVehicleMessages = async (req, res) => {
    const { vehicleMessage } = req.body;

    VehicleMessage.find(vehicleMessage)
        .populate({
            path: "user",
            model: "User",
            select: "_id email fullName",
        })
        .populate({
            path: "vehicle",
            model: "Vehicle",
            select: "_id name label",
        })
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            return res
                .status(200)
                .json({ success: true, vehicleMessages: data });
        });
};

exports.addVehicleMessage = async (req, res) => {
    const { vehicleMessage } = req.body;

    if (!vehicleMessage) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleMessage(vehicleMessage).save(async function(err, data) {
        if (err) return res.status(500).json({ success: false, error: err });
        await data.populate({
                path: "user",
                model: "User",
                select: "_id email fullName",
            })
            .populate({
                path: "vehicle",
                model: "Vehicle",
                select: "_id name label",
            })
            .execPopulate();
        return res.status(200).json({ success: true, vehicleMessage: data });
    });
};

exports.updateVehicleMessage = async (req, res) => {
    const { vehicleMessage } = req.body;
    if (!vehicleMessage) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleMessage.findByIdAndUpdate(vehicleMessage._id, vehicleMessage, { new: true })
        .populate({
            path: "user",
            model: "User",
            select: "_id email fullName",
        })
        .populate({
            path: "vehicle",
            model: "Vehicle",
            select: "_id name label",
        })
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res
                .status(200)
                .json({ success: true, vehicleMessage: data });
        });
};

exports.deleteVehicleMessage = async (req, res) => {
    const id = req.query.id;

    console.log("DELETE");

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleMessage.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
