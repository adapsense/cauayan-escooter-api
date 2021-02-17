const express = require("express");
const feedbackRouter = express.Router();
const feedbackController = require("../controllers/feedbackController");
const moment = require("moment");
const multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

if (process.env.ENV == "dev") {
    upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./public/uploads/feedbacks");
            },
            filename: (req, file, cb) => {
                var filename =
                    moment().format("YYYYMMDD_hhmmss") +
                    "_" +
                    file.originalname;
                cb(null, filename);
            },
        }),
    });
}

module.exports = feedbackRouter;

feedbackRouter.get("/", feedbackController.getFeedbacks);

feedbackRouter.post("/", feedbackController.getFeedbacks);

feedbackRouter.put("/", upload.single("image"), feedbackController.addFeedback);

feedbackRouter.patch("/", feedbackController.updateFeedback);

feedbackRouter.delete("/", feedbackController.deleteFeedback);
