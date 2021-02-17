const UserGroup = require("../models/UserGroup");
const userGroupRouter = require("../routes/userGroup");

exports.getUserGroups = async (req, res) => {

    const { userGroup } = req.body;

    UserGroup.find(userGroup).exec(function(err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err
            });
        return res
            .status(200)
            .json({ success: true, userGroups: data });
    });
};

exports.addUserGroup = async (req, res) => {
    const { userGroup } = req.body;

    if (!userGroup) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserGroup(userGroup).save((err, data) => {
        if (err)
            return res
                .status(500)
                .json({ success: false, error: err });
        return res
            .status(200)
            .json({ success: true, userGroup: data });
    });
};

exports.updateUserGroup = async (req, res) => {
    const { userGroup } = req.body;

    if (!userGroup) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserGroup.findByIdAndUpdate(
        userGroup._id,
        userGroup,
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
                .json({ success: true, userGroup: data });
        }
    );
};

exports.deleteUserGroup = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserGroup.deleteOne({ _id: id }, function (
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
