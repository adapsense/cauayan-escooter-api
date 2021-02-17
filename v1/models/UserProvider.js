const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const Schema = mongoose.Schema;

var nameValidator = [
    validate({
        validator: "matches",
        arguments: /^[a-z0-9 ]+$/i,
        passIfEmpty: false,
        message: "Name should contain alphanumeric characters only"
    })
];

const UserProviderSchema = new Schema(
    {
        name: { type: String, required: true, validate: nameValidator },
        description: { type: String, default: "" },
        isSocial: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "UserProvider",
    UserProviderSchema,
    "userProviders"
);
