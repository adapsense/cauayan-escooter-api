const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const Schema = mongoose.Schema;
mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");
var bcrypt = require("bcryptjs");

var nameValidator = [
    validate({
        validator: "matches",
        arguments: /^[a-z ]+$/i,
        passIfEmpty: false,
        message: "Name should contain alphabetic characters only",
    }),
];

var emailValidator = [
    validate({
        validator: "isEmail",
        passIfEmpty: false,
        message: "Email is invalid",
    }),
];

var mobileValidator = [
    validate({
        validator: "isNumeric",
        arguments: /^[a-z ]+$/i,
        passIfEmpty: false,
        message: "Mobile is invalid",
    }),
];

const UserSchema = new Schema(
    {
        userProvider: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserProvider",
        },
        userType: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserType",
        },
        userGroup: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserGroup",
        },
        userStatus: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserStatus",
        },
        facebookId: { type: String, default: "" },
        googleId: { type: String, default: "" },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: emailValidator,
        },
        password: { type: String, required: true, default: "" },
        fullName: { type: String, required: true, validate: nameValidator },
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        mobile: { type: String, default: "" },
        image: { type: String, default: "" },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", function (next) {
    var user = this;
    if (this.facebookId.length != 0 || this.googleId.length != 0) {
        next();
    } else {
        if (this.isModified("password") || this.isNew) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    }
});

UserSchema.pre("findOneAndUpdate", function (next) {
    var user = this._update;
    if(user.newPassword) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.newPassword, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                delete user.oldPassword;
                delete user.newPassword;
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
