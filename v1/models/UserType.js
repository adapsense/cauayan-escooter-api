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

const UserTypeSchema = new Schema(
    {
        name: { type: String, required: true, validate: nameValidator },
        description: { type: String, default: "" },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("UserType", UserTypeSchema, "userTypes");
