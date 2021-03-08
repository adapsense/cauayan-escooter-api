const UserProvider = require("../models/UserProvider");
const UserType = require("../models/UserType");
const UserStatus = require("../models/UserStatus");
const User = require("../models/User");
const VehicleStatus = require("../models/VehicleStatus");
const Vehicle = require("../models/Vehicle");
const VehicleLease = require("../models/VehicleLease");
var config = require("../../config/database");
var jwt = require("jsonwebtoken");

exports.getError = async (req, res) => {
    return res.status(403).json({
        success: false,
        error: "Unauthorized."
    });
};

exports.getUsers = async (req, res) => {

    const { user } = req.body;

    var auth = req.user;

    if (!auth || !auth.userType.isAdmin) {
        return res.status(403).send({ success: false, error: "Unauthorized." });
    }

    var query = {};

    if(user) {
        query = user;
    }

    query.userGroup = auth.userGroup._id;

    User.find(query)
        .populate("userType")
        .populate("userProvider")
        .populate("userGroup")
        .populate("userStatus")
        .select("-password")
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            return res.status(200).json({ success: true, users: data });
        });
};

exports.searchUser = async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    User.findOne(user)
        .select("fullName email")
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            return res.status(200).json({ success: true, user: data });
        });
};

exports.getUser = async (req, res) => {
    var user;

    if (req.user) {
        user = req.user;
    } else {
        user = req.body.user;
    }

    const { vehicle } = req.body;

    const isAdmin = req.query.isAdmin === "true";
    const isMobile = req.query.isMobile === "true";

    if (!user || (!isAdmin && isMobile && !vehicle)) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    User.findOne({ email: user.email })
        .populate("userType")
        .populate("userProvider")
        .populate("userGroup")
        .populate("userStatus")
        .populate("-password")
        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });

            if (!data) {
                res.status(401).send({
                    success: false,
                    error: "Authentication failed. User not found.",
                });
            } else {
                data.comparePassword(user.password, function (
                    err,
                    isMatch
                ) {
                    if (isMatch && !err) {
                        var token = jwt.sign(data.toJSON(), config.secret);
                        if (isAdmin || !isMobile) {
                            return res.status(200).json({
                                success: true,
                                user: data,
                                token: token,
                            });
                        } else {
                            updateVehicle(data, token, vehicle, res);
                        }
                    } else {
                        return res.status(401).send({
                            success: false,
                            error: "Authentication failed. Wrong password.",
                        });
                    }
                });
            }
        });
};

exports.addUser = async (req, res) => {
    const { user, vehicle } = req.body;

    const isAdmin = req.query.isAdmin === "true";

    if (!user || (!isAdmin && !vehicle)) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    if(isAdmin && req.user) {
        user.userGroup = req.user.userGroup._id;
    } else if(vehicle) {
        user.userGroup = vehicle.admin.userGroup._id;
    }

    UserProvider.findOne({ isSocial: false })
        .exec((userProviderFindErr, userProviderFindData) => {
            if(userProviderFindErr)
                return res.status(500).json({
                    success: false,
                    error: userProviderFindErr,
                });
            user.userProvider = userProviderFindData._id;
            UserType.findOne({ isAdmin: isAdmin }).exec(
                (userTypeFindErr, userTypeFindData) => {
                    if(userTypeFindErr)
                        return res.status(500).json({
                            success: false,
                            error: userTypeFindErr,
                        });
                    user.userType = userTypeFindData._id;
                    UserStatus.findOne({
                        isActive: true,
                    }).exec((userStatusFindErr, userStatusFindData) => {
                        if (userStatusFindErr)
                            return res.status(500).json({
                                success: false,
                                error: userStatusFindErr,
                            });
                        user.userStatus = userStatusFindData._id;
                        console.log("183");
                        User(user).save((userSaveErr, userSaveData) => {
                            console.log("userSaveErr " + userSaveErr);
                            if (userSaveErr) {
                                if (
                                    userSaveErr.errmsg &&
                                    userSaveErr.errmsg.indexOf(
                                        "duplicate key error"
                                    ) !== -1
                                ) {
                                    userSaveErr =
                                        "A user with this email is already registered.";
                                }
                                console.log("195 ");
                                return res.status(500).json({
                                    success: false,
                                    error: userSaveErr,
                                });
                            }
                            User.findById(userSaveData._id)
                                .populate("userGroup")
                                .populate("userType")
                                .populate("userProvider")
                                .populate("userStatus")
                                .select("-password")
                                .exec((userFindErr, userFindData) => {
                                        console.log("208");
                                    if (userFindErr)
                                        return res.status(500).json({
                                            success: false,
                                            error: userFindErr,
                                        });
                                    var token = jwt.sign(
                                        userFindData.toJSON(),
                                        config.secret
                                    );
                                    if (isAdmin) {
                                        return res.status(200).json({
                                            success: true,
                                            user: userFindData,
                                            token: token,
                                        });
                                    } else {
                                        updateVehicle(
                                            userFindData,
                                            token,
                                            vehicle,
                                            res
                                        );
                                    }
                                });
                        });
                    });
                    
                }
            );
    })

};

function updateVehicle(user, token, vehicle, res) {
    VehicleStatus.findOne({
        isInUse: true,
    }).exec((vehicleStatusFindErr, vehicleStatusFindData) => {
        if (vehicleStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: vehicleStatusFindErr,
            });
        }
        Vehicle.findByIdAndUpdate(
            vehicle._id,
            {
                vehicleStatus:
                    vehicleStatusFindData._id,
                rider: user._id,
            },
            {
                new: true,
            },
            function (
                vehicleFindErr,
                vehicleFindData
            ) {
                if (vehicleFindErr) {
                    return res
                        .status(500)
                        .json({
                            success: false,
                            error: vehicleFindErr,
                        });
                }
                var vehicleLease = {
                    rider: user._id,
                    vehicle: vehicle._id
                };
                VehicleLease(vehicleLease)
                    .save((vehicleLeaseSaveErr, vehicleLeaseSaveData) => {
                        if (vehicleLeaseSaveErr) {
                            return res.status(500).json({
                                success: false,
                                error: vehicleLeaseSaveErr,
                            });
                        }
                        return res.status(200).json({
                            success: true,
                            user: user,
                            token: token,
                        });
                    });
            }
        );
    });
}

exports.updateUser = async (req, res) => {

    var auth = req.user;

    const { user } = req.body;

    if (!user) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    if(!user._id) {
        user._id = auth._id;
    }

    if(user.password) {
        delete user.password;
    }

    User.findById(user._id)
        .populate("userProvider")
        .populate("userType")
        .populate("userGroup")
        .populate("userStatus")
        .exec((userFindErr, userFindData) => {
            if (userFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: userFindErr });
            if (auth.userType.isAdmin) {
                if (auth.userGroup._id == userFindData.userGroup._id) {
                    update(false, user, res);
                } else {
                    return res
                        .status(403)
                        .send({ success: false, error: "Unauthorized." });
                }
            } else {
                if (auth._id == userFindData._id) {
                    update(false, user, res);
                } else {
                    return res
                        .status(403)
                        .send({ success: false, error: "Unauthorized." });
                }
            }
        });
};

function update(isDeleted, user, res) {
    User.findByIdAndUpdate(user._id, user, { new: true })
        .populate("userProvider")
        .populate("userType")
        .populate("userGroup")
        .populate("userStatus")
        .select("-password")
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            if(!isDeleted) {
                var token = jwt.sign(data.toJSON(), config.secret);
                return res
                    .status(200)
                    .json({ success: true, user: data, token: token });
            } else {
                return res.status(200).json({ success: true, user: data });
            }
            
        });
}

exports.updatePasswordUser = async (req, res) => {

    var auth = req.user;

    const { user } = req.body;

    if (!user || !user.oldPassword || !user.newPassword) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    User.findById(auth._id)
        .exec((userFindErr, userFindData) => {
            if (userFindErr)
                return res
                    .status(500)
                    .json({ success: false, error: userFindErr });
                userFindData.comparePassword(user.oldPassword, function (err, isMatch) {
                    if (isMatch) {
                        User.findByIdAndUpdate(auth._id, user, { new: true })
                            .populate("userProvider")
                            .populate("userType")
                            .populate("userGroup")
                            .populate("userStatus")
                            .select("-password")
                            .exec((userUpdateErr, userUpdateData) => {
                                if (userUpdateErr)
                                    return res.status(500).json({
                                        success: false,
                                        error: userUpdateErr,
                                    });
                                var token = jwt.sign(
                                    userUpdateData.toJSON(),
                                    config.secret
                                );
                                return res.status(200).json({
                                    success: true,
                                    user: userUpdateData,
                                    token: token,
                                });
                            });
                    } else { 
                        return res.status(500).json({
                            success: false,
                            error: err ? err : "Old password is incorrect.",
                        });
                    }
                });
        });

};

exports.deleteUser = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserStatus.findOne({
        isDeleted: true,
    }).exec((userStatusFindErr, userStatusFindData) => {
        if (userStatusFindErr) {
            return res.status(500).json({
                success: false,
                error: userStatusFindErr,
            });
        }
        User.findById(id)
            .populate("userProvider")
            .populate("userType")
            .populate("userGroup")
            .populate("userStatus")
            .select("-password")
            .lean()
            .exec((userFindErr, userFindData) => {
                if (userFindErr)
                    return res
                        .status(500)
                        .json({ success: false, error: userFindErr });
                userFindData.userStatus = userStatusFindData._id;
                update(true, userFindData, res);
            });
    });
};
