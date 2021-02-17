const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserStatusSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        isActive: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "UserStatus",
    UserStatusSchema,
    "userStatuses"
);
