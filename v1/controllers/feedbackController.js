const Feedback = require("../models/Feedback");

exports.getFeedbacks = async (req, res) => {

    const { feedback } = req.body;

    Feedback.find(feedback).exec(function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(200).json({
            success: true,
            feedbacks: data,
        });
    });
};

exports.addFeedback = async (req, res) => {
    var { feedback } = req.body;

    if (!feedback) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    const file = req.file;

    if (file) {
        feedback = JSON.parse(feedback);
        if (process.env.ENV == "dev") {
            feedback.image = "feedbacks/" + file.filename;
            add(feedback, req, res);
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
                file.originalname;

            var params = {
                Bucket: process.env.S3_BUCKET_NAME + "/feedbacks",
                Key: filename,
                Body: file.buffer,
                ACL: process.env.S3_BUCKET_ACL,
            };

            s3bucket.putObject(params, function (err, data) {
                if (err) {
                    return res.status(500).json({ success: false, error: err });
                } else {
                    feedback.image = "feedbacks/" + filename;
                    add(feedback, req, res);
                }
            });
        }
    } else {
        add(feedback, req, res);
    }
};

function add(feedback, req, res) {
    if (!feedback.user) {
        feedback.user = req.user._id;
    }
    Feedback(feedback).save(async (err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        await data.populate({
            path: "user",
            model: "User",
            select: "_id fullName email",
        }).execPopulate();
        return res.status(200).json({ success: true, feedback: data });
    });
}

exports.updateFeedback = async (req, res) => {
    const { feedback } = req.body;

    if (!feedback) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    Feedback.findByIdAndUpdate(
        feedback._id,
        feedback,
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
                .json({ success: true, feedback: data });
        }
    );
};

exports.deleteFeedback = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters."
        });
    }

    Feedback.deleteOne({ _id: id }, function (
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
