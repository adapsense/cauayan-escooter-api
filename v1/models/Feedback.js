const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
