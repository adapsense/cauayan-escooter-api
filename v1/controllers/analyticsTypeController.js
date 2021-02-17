const AnalyticsType = require("../models/AnalyticsType");

exports.getAnalyticsTypes = async (req, res) => {
    const { analyticsType } = req.body;

    AnalyticsType.find(analyticsType).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, analyticsTypes: data });
    });
};

exports.addAnalyticsType = async (req, res) => {
    const { analyticsType } = req.body;

    if (!analyticsType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    AnalyticsType(analyticsType).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, analyticsType: data });
    });
};

exports.updateAnalyticsType = async (req, res) => {
    const { analyticsType } = req.body;

    if (!analyticsType) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    AnalyticsType.findByIdAndUpdate(
        analyticsType._id,
        analyticsType,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, analyticsType: data });
        }
    );
};

exports.deleteAnalyticsType = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    AnalyticsType.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
