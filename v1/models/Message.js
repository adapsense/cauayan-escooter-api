const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, default: null },
        seen: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", MessageSchema);
