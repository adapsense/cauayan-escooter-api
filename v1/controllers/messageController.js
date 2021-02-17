const Thread = require("../models/Thread");
const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
    const { message } = req.body;

    Message.find(message ).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({ success: true, messages: data });
    });
};

exports.addMessage = async (req, res) => {
    const { thread, message } = req.body;

    if (!thread || !message) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Thread.findById(
        thread._id,
        (threadFindErr, threadFindData) => {
            if (threadFindErr)
                return res.status(500).json({
                    success: false,
                    error: threadFindErr,
                });
            Message(message).save((err, data) => {
                if (err) return res.status(500).json({ success: false, error: err });
                threadFindData.messages.push(data);
                Thread.findByIdAndUpdate(threadFindData._id, threadFindData, { new: true, }, 
                    async function(threadSaveErr, threadSaveData) {
                        if (threadSaveErr)
                            return res.status(500).json({
                                success: false,
                                error: threadSaveErr
                            });
                        await data.populate({
                            path: "sender",
                            model: "User",
                            select: "_id fullName email",
                        }).execPopulate();
                        return res.status(200).json({ success: true, message: data });
                })
                
            });
        }
    );
};

exports.updateMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    update(message, res);
};

exports.seenMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    message.seen = Date.now();
    update(message, res);
};

function update(message, res) {

    Message.findByIdAndUpdate(message._id, message, { new: true, })
        .populate({
            path: "sender",
            model: "User",
            select: "_id fullName email",
        })
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, message: data });
        }
    );
};

exports.deleteMessage = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Message.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
