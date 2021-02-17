const VehicleStatus = require("../models/VehicleStatus");
const Vehicle = require("../models/Vehicle");
require('babel-polyfill');
const brandedQRCode = require('branded-qr-code');
const fs = require("fs");
const AWS = require("aws-sdk");
const moment = require("moment");

exports.getVehicles = async (req, res) => {

    var user = req.user;

    const { vehicle } = req.body;

    const code = req.query.code;

    if (code) {
        Vehicle.findOne({ code: { $regex: code, $options: "i" } })
            .populate({
                path: "admin",
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
            .populate({ path: "rider", model: "User", select: "_id" })
            .populate({
                path: "vehicleType",
                model: "VehicleType",
                select: "_id name",
            })
            .populate({
                path: "vehicleStatus",
                model: "VehicleStatus",
                select: "_id name isAvailable isInUse isDeleted",
                match: {
                    isAvailable: true,
                },
            })
            .lean()
            .exec(function (err, data) {
                if (err || !data) {
                    if (!data) {
                        err = "No vehicles found.";
                    }
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                }
                var vehicle = null;
                if (data.vehicleStatus) {
                    vehicle = data;
                }
                return res
                    .status(200)
                    .json({ success: true, vehicle: vehicle });
            });
    } else if(user.userType.isAdmin) {
        Vehicle.find(vehicle)
            .populate({
                path: "admin",
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
                            _id: user.userGroup._id,
                        },
                    },
                    {
                        path: "userStatus",
                        model: "UserStatus",
                    },
                ],
            })
            .populate({
                path: "rider",
                model: "User",
                select: "_id fullName email",
            })
            .populate({
                path: "vehicleType",
                model: "VehicleType",
                select: "_id name",
            })
            .populate({
                path: "vehicleStatus",
                model: "VehicleStatus",
                select: "_id name isAvailable isInUse isDeleted",
            })
            .sort({ createddAt: 1 })
            .lean()
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                var vehicles = [];
                data.forEach((vehicle) => {
                    if (vehicle.admin) {
                        delete vehicle.admin;
                        vehicles.push(vehicle);
                    }
                });
                return res
                    .status(200)
                    .json({ success: true, vehicles: vehicles });
            });
    } else {
        Vehicle.find(vehicle)
            .populate({
                path: "rider",
                model: "User",
                select: "-password",
                match: {
                    _id: user._id,
                },
            })
            .populate({
                path: "vehicleType",
                model: "VehicleType",
                select: "_id name",
            })
            .populate({
                path: "vehicleStatus",
                model: "VehicleStatus",
                select: "_id name isAvailable isInUse isDeleted",
            })
            .sort({ updatedAt: 1 })
            .lean()
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                var vehicles = [];
                data.forEach((vehicle) => {
                    if (vehicle.rider) {
                        delete vehicle.admin;
                        delete vehicle.rider;
                        vehicles.push(vehicle);
                    }
                });
                return res
                    .status(200)
                    .json({ success: true, vehicles: vehicles });
            });
    }
};

exports.addVehicle = async (req, res) => {
    const { vehicle } = req.body;

    if (!vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    if (req.user) {
        vehicle.admin = req.user._id;
    }
    
    const file = req.file;

    if (file) {
        vehicle = JSON.parse(vehicle);
        if (process.env.ENV == "dev") {
            vehicle.image = "vehicles/" + file.filename;
            add(vehicle, req, res);
        } else {
            const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
            let s3bucket = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            });

            let filename =
                moment().format("YYYYMMDD_hhmmss") +
                "_" +
                vehicle._id +
                "_" +
                file.originalname;

            var params = {
                Bucket: process.env.S3_BUCKET_NAME + "/vehicles",
                Key: filename,
                Body: file.buffer,
                ACL: process.env.S3_BUCKET_ACL,
            };

            s3bucket.putObject(params, function (err, data) {
                if (err) {
                    return res
                        .status(500)
                        .json({ success: false, error: err });
                } else {
                    vehicle.image = "vehicles/" + filename;
                    add(vehicle, req, res);
                }
            });
        }
    } else {
        add(vehicle, req, res);
    }
    
};

function add(vehicle, req, res) {
    VehicleStatus.findOne({
        isAvailable: false,
        isInUse: false,
        isInRepair: false,
        isDeleted: false
    }).exec((vehicleStatusFindErr, vehicleStatusFindData) => {
        if (vehicleStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: vehicleStatusFindErr,
            });
        }
        vehicle.vehicleStatus = vehicleStatusFindData._id;
        Vehicle(vehicle).save((vehicleSaveErr, vehicleSaveData) => {
            if (vehicleSaveErr)
                return res
                    .status(500)
                    .json({ success: false, error: vehicleSaveErr });
            vehicleSaveData.code =
                vehicleSaveData._id.toString().toLowerCase() +
                vehicle.name.toLowerCase();
            vehicleSaveData.qr = `vehicles/${vehicleSaveData.name.toLowerCase()}.png`;

            brandedQRCode
                .generate({
                    text: vehicleSaveData.code,
                    path: `../../../public/uploads/qr/${req.user.userGroup.label}.png`,
                    ignoreCache: true,
                    opt: {
                        margin: 1,
                        width: 1200,
                        height: 1200,
                    },
                })
                .then((buffer) => {
                    if (process.env.ENV == "dev") {
                        fs.writeFile(
                            __dirname +
                                `/../../public/uploads/vehicles/${vehicleSaveData.name.toLowerCase()}.png`,
                            buffer,
                            function (err) {
                                if (err)
                                    return res
                                        .status(500)
                                        .json({ success: false, error: err });
                                update(vehicleSaveData, res);
                            }
                        );
                    } else {
                        const spacesEndpoint = new AWS.Endpoint(
                            process.env.S3_ENDPOINT
                        );
                        let s3bucket = new AWS.S3({
                            endpoint: spacesEndpoint,
                            accessKeyId: process.env.S3_ACCESS_KEY_ID,
                            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                        });

                        var params = {
                            Bucket: process.env.S3_BUCKET_NAME + "/vehicles",
                            Key: `${vehicleSaveData.name.toLowerCase()}.png`,
                            Body: buffer,
                            ACL: process.env.S3_BUCKET_ACL,
                        };

                        s3bucket.putObject(params, function (s3Err, s3Data) {
                            if (s3Err) {
                                return res.status(500).json({
                                    success: false,
                                    error: s3Err,
                                });
                            } else {
                                update(vehicleSaveData, res);
                            }
                        });
                    }
                });
        });
    });
}

exports.updateVehicle = async (req, res) => {
    var { vehicle } = req.body;
    if (!vehicle) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    const file = req.file;

    if (file) {
        vehicle = JSON.parse(vehicle);
        if (process.env.ENV == "dev") {
            vehicle.image = "vehicles/" + file.filename;
            update(vehicle, res);
        } else {
            
            const spacesEndpoint = new AWS.Endpoint(
                process.env.S3_ENDPOINT
            );
            let s3bucket = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            });

            let filename =
                moment().format("YYYYMMDD_hhmmss") +
                "_" +
                vehicle._id +
                "_" +
                file.originalname;

            var params = {
                Bucket: process.env.S3_BUCKET_NAME + "/vehicles",
                Key: filename,
                Body: file.buffer,
                ACL: process.env.S3_BUCKET_ACL,
            };

            s3bucket.putObject(params, function (err, data) {
                if (err) {
                    return res
                        .status(500)
                        .json({ success: false, error: err });
                } else {
                    vehicle.image = "vehicles/" + filename;
                    update(vehicle, res);
                }
            });
        }
    } else if(vehicle.rider && !vehicle.vehicleStatus) {
        VehicleStatus.findOne({
            isInUse: true,
        }).exec((vehicleStatusFindErr, vehicleStatusFindData) => {
            if (vehicleStatusFindErr) {
                return res.status(500).json({
                    success: false,
                    error: vehicleStatusFindErr,
                });
            }
            vehicle.vehicleStatus = vehicleStatusFindData._id;
            update(vehicle, res);
        });
    } else {
        update(vehicle, res);
    }

};

function update(vehicle, res) {

    if(vehicle.vehicleStatus && !vehicle.vehicleStatus.isInUse) {
        vehicle.rider = null;
    }

    Vehicle.findByIdAndUpdate(vehicle._id, vehicle, { new: true })
        .populate({
            path: "rider",
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
        .populate({
            path: "vehicleType",
            model: "VehicleType",
            select: "_id name",
        })
        .populate({
            path: "vehicleStatus",
            model: "VehicleStatus",
            select: "_id name isAvailable isInUse isDeleted",
        })
        .select("-admin")
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, vehicle: data });
        });
}

exports.deleteVehicle = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    VehicleStatus.findOne({
        isDeleted: true,
    }).exec((vehicleStatusFindErr, vehicleStatusFindData) => {
        if (vehicleStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: vehicleStatusFindErr,
            });
        }
        Vehicle.findById(id)
            .populate({
                path: "rider",
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
            .populate({
                path: "vehicleType",
                model: "VehicleType",
                select: "_id name",
            })
            .populate({
                path: "vehicleStatus",
                model: "VehicleStatus",
                select: "_id name isAvailable isInUse isDeleted",
            })
            .lean()
            .exec((vehicleFindErr, vehicleFindData) => {
                if (vehicleFindErr) {
                    return res.status(500).json({
                        success: false,
                        error: vehicleFindErr,
                    });
                }
                vehicleFindData.vehicleStatus = vehicleStatusFindData._id;
                update(vehicleFindData, res);
            });
    });
};
