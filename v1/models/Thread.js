const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
    {
        rider: { type: Schema.Types.ObjectId, ref: "User" },
        messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Thread", ThreadSchema);
