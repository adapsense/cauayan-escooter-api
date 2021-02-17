const UserStatus = require("../models/UserStatus");

exports.getUserStatuses = async (req, res) => {
    const { userStatus } = req.body;

    UserStatus.find(userStatus).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, userStatuses: data });
    });
};

exports.addUserStatus = async (req, res) => {
    const { userStatus } = req.body;

    if (!userStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    UserStatus(userStatus).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, userStatus: data });
    });
};

exports.updateUserStatus = async (req, res) => {
    const { userStatus } = req.body;

    if (!userStatus) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    UserStatus.findByIdAndUpdate(
        userStatus._id,
        userStatus,
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

exports.deleteUserStatus = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    UserStatus.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
