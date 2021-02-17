const UserProvider = require("../models/UserProvider");

exports.getUserProviders = async (req, res) => {

    const { userProvider } = req.body;

    UserProvider.find(userProvider).exec(function(err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err
            });
        return res
            .status(200)
            .json({ success: true, userProviders: data });
    });
};

exports.addUserProvider = async (req, res) => {
    const { userProvider } = req.body;

    if (!userProvider) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserProvider(userProvider).save((err, data) => {
        if (err)
            return res
                .status(500)
                .json({ success: false, error: err });
        return res
            .status(200)
            .json({ success: true, userProvider: data });
    });
};

exports.updateUserProvider = async (req, res) => {
    const { userProvider } = req.body;

    if (!userProvider) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    UserProvider.findByIdAndUpdate(
        userProvider._id,
        userProvider,
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
                .json({ success: true, userProvider: data });
        }
    );
};

exports.deleteUserProvider = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    UserProvider.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
