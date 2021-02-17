const UserType = require("../models/UserType");

exports.getUserTypes = async (req, res) => {

    const { userType } = req.body;

    UserType.find(userType).exec(function(err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err
            });
        return res
            .status(200)
            .json({ success: true, userTypes: data });
    });
};

exports.addUserType = async (req, res) => {
    const { userType } = req.body;

    if (!userType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserType(userType).save((err, data) => {
        if (err)
            return res
                .status(500)
                .json({ success: false, error: err });
        return res
            .status(200)
            .json({ success: true, userType: data });
    });
};

exports.updateUserType = async (req, res) => {
    const { userType } = req.body;

    if (!userType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserType.findByIdAndUpdate(
        userType._id,
        userType,
        {
            new: true
        },
        function(err, data) {
            if (err)
                return res
                    .status(500)
                    .json({ success: false, error: err });
            return res
                .status(200)
                .json({ success: true, userType: data });
        }
    );
};

exports.deleteUserType = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserType.deleteOne({ _id: id }, function (
        err,
        data
    ) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err
            });
        return res.status(204).send();
    });
};
