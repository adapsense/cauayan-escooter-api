const GeofenceStatus = require("../models/GeofenceStatus");
const Geofence = require("../models/Geofence");

exports.getGeofences = async (req, res) => {
    const { geofence } = req.body;

    var auth = req.user;

    if (!auth || !auth.userType.isAdmin) {
        return res.status(403).send({ success: false, error: "Unauthorized." });
    }

    var query = {};

    if (geofence) {
        query = geofence;
    }

    Geofence.find(query)
        .populate("geofenceStatus")
        .populate({
            path: "user",
            model: "User",
            select: "-password",
            populate: [
                {
                    path: "userType",
                    model: "UserType",
                },
                {
                    path: "userGroup",
                    model: "UserGroup",
                    match: {
                        _id: auth.userGroup._id,
                    },
                },
                {
                    path: "userStatus",
                    model: "UserStatus",
                },
            ],
        })
        .lean()
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            var geofences = [];
            data.forEach((geofence) => {
                if (geofence.user) {
                    geofences.push(geofence);
                }
            });
            return res
                .status(200)
                .json({ success: true, geofences: geofences });
        });
};

exports.addGeofence = async (req, res) => {
    const { geofence } = req.body;

    if (!geofence) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    if (!geofence.user) {
        geofence.user = req.user._id;
    }

    GeofenceStatus.findOne({
        isActive: true,
    }).exec((geofenceStatusFindErr, geofenceStatusFindData) => {
        if (geofenceStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: geofenceStatusFindErr,
            });
        }
        geofence.geofenceStatus = geofenceStatusFindData._id;
        Geofence(geofence).save(async function (
            geofenceSaveErr,
            geofenceSaveData
        ) {
            if (geofenceSaveErr)
                return res
                    .status(500)
                    .json({ success: false, error: geofenceSaveErr });
            await geofenceSaveData
                .populate("geofenceStatus")
                .populate({
                    path: "user",
                    model: "User",
                    select: "-password",
                    populate: [
                        {
                            path: "userType",
                            model: "UserType",
                        },
                        {
                            path: "userGroup",
                            model: "UserGroup",
                        },
                        {
                            path: "userStatus",
                            model: "UserStatus",
                        },
                    ],
                })
                .execPopulate();
            return res
                .status(200)
                .json({ success: true, geofence: geofenceSaveData });
        });
    });

    
};

exports.updateGeofence = async (req, res) => {
    const { geofence } = req.body;

    if (!geofence) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    update(geofence, res);
    
};

function update(geofence, res) {
    Geofence.findByIdAndUpdate(geofence._id, geofence, { new: true, })
        .populate("geofenceStatus")
        .populate({
            path: "user",
            model: "User",
            select: "-password",
            populate: [
                {
                    path: "userType",
                    model: "UserType",
                },
                {
                    path: "userGroup",
                    model: "UserGroup",
                },
                {
                    path: "userStatus",
                    model: "UserStatus",
                },
            ],
        })
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, geofence: data });
        }
    );
}

exports.deleteGeofence = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    GeofenceStatus.findOne({
        isDeleted: true,
    }).exec((geofenceStatusFindErr, geofenceStatusFindData) => {
        if (geofenceStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: geofenceStatusFindErr,
            });
        }
        Geofence.findById(id)
            .populate("geofenceStatus")
            .populate({
                path: "user",
                model: "User",
                select: "-password",
                populate: [
                    {
                        path: "userType",
                        model: "UserType",
                    },
                    {
                        path: "userGroup",
                        model: "UserGroup",
                    },
                    {
                        path: "userStatus",
                        model: "UserStatus",
                    },
                ],
            })
            .lean()
            .exec((geofenceFindErr, geofenceFindData) => {
                if (geofenceFindErr)
                    return res
                        .status(500)
                        .json({ success: false, error: userFindErr });
                geofenceFindData.geofenceStatus = geofenceStatusFindData._id;
                update(geofenceFindData, res);
            });
    });

};
