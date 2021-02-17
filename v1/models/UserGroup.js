const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const Schema = mongoose.Schema;

var labelValidator = [
    validate({
        validator: "matches",
        arguments: /^[a-z ]+$/i,
        passIfEmpty: false,
        message: "Label should contain alpha characters only"
    })
];

var nameValidator = [
    validate({
        validator: "matches",
        arguments: /^[a-z0-9 ]+$/i,
        passIfEmpty: false,
        message: "Name should contain alphanumeric characters only"
    })
];

const UserGroupSchema = new Schema(
    {
        label: { type: String, required: true, validate: labelValidator },
        name: { type: String, required: true, validate: nameValidator },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("UserGroup", UserGroupSchema, "userGroups");
