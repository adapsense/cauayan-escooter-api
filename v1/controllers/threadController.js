const Thread = require("../models/Thread");

exports.getThreads = async (req, res) => {

    const { thread } = req.body;

    var auth = req.user;

    if (!thread && auth.userType.isAdmin) {
        Thread.find(thread)
            .populate({
                path: "rider",
                model: "User",
                select: "_id userType userGroup userStatus fullName email",
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
            .select("-messages")
            .sort({ updatedAt: -1 })
            .lean()
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                var threads = [];
                data.forEach((thread) => {
                    if (thread.rider.userGroup) {
                        delete thread.rider.userType;
                        delete thread.rider.userGroup;
                        delete thread.rider.userStatus;
                        threads.push(thread);
                    }
                });
                return res.status(200).json({ success: true, threads: threads });
        });
    } else {
        Thread.find(thread)
            .populate({
                path: "rider",
                model: "User",
                select: "_id fullName email"
            })
            .populate({
                path: "messages",
                model: "Message",
                populate: {
                    path: "sender",
                    model: "User",
                    select: "_id fullName email",
                    sort: { createdAt: 1 },
                },
            })
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                return res.status(200).json({ success: true, threads: data });
            });
    }

};

exports.addThread = async (req, res) => {
    const { thread } = req.body;

    if (!thread) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Thread(thread).save(async function(err, data) {
        if (err) return res.status(500).json({ success: false, error: err });
        await data.populate({
            path: "rider",
            model: "User",
            select: "_id fullName email",
        }).execPopulate();
        return res.status(200).json({ success: true, thread: data });
    });
};

exports.updateThread = async (req, res) => {
    const { thread } = req.body;

    if (!thread) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Thread.findByIdAndUpdate(
        thread._id,
        thread,
        {
            new: true,
        },
        function (err, data) {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, thread: data });
        }
    );
};

exports.deleteThread = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Thread.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
