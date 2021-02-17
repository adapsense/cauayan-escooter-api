const Log = require("../models/Log");

exports.getLogs = async (req, res) => {

    var count = parseInt(req.query.count);
    if(!count || count > 30) {
        count = 30;
    }

    const { log } = req.body;

    Log.find(log)
        .sort({ createdAt: -1 })
        .limit(count)
        .populate({
            path: "user",
            model: "User",
            select: "_id email fullName",
        })

        .exec(function (err, data) {
            if (err)
                return res.status(500).json({
                    success: false,
                    error: err,
                });
            return res.status(200).json({ success: true, logs: data });
        });
};

exports.addLog = async (req, res) => {
    const { log } = req.body;

    if (!log) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Log(log).save((err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, log: data });
    });
};

exports.updateLog = async (req, res) => {
    const { log } = req.body;

    if (!log) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Log.findByIdAndUpdate(
        log._id,
        log,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, log: data });
        }
    );
};

exports.deleteLog = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Log.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
