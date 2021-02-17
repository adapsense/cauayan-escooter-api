const GeofenceStatus = require("../models/GeofenceStatus");

exports.getGeofenceStatuses = async (req, res) => {
    const { geofenceStatus } = req.body;

    GeofenceStatus.find(geofenceStatus).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, geofenceStatuses: data });
    });
};

exports.addGeofenceStatus = async (req, res) => {
    const { geofenceStatus } = req.body;

    if (!geofenceStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    GeofenceStatus(geofenceStatus).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, geofenceStatus: data });
    });
};

exports.updateGeofenceStatus = async (req, res) => {
    const { geofenceStatus } = req.body;

    if (!geofenceStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    GeofenceStatus.findByIdAndUpdate(
        geofenceStatus._id,
        geofenceStatus,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, userStatus: data });
        }
    );
};

exports.deleteGeofenceStatus = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    GeofenceStatus.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
