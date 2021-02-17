const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", default: null },
        url: { type: String, default: null },
        method: { type: String, default: null },
        headers: { type: Schema.Types.Object, default: null },
        query: { type: Schema.Types.Object, default: null },
        body: { type: Schema.Types.Object, default: null },
        collectionName: { type: String, default: null },
        documentId: { type: String, default: null },
        topic: { type: String, default: null },
        message: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Log", LogSchema);
