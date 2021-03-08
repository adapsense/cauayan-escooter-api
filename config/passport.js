var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require("../v1/models/User");
var config = require("../config/database");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret;
    passport.use(
        new JwtStrategy(opts, function(jwt_payload, done) {
            User.findOne({ id: jwt_payload.id }, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        })
    );

};

function signin(profile, done) {
    User.findOne({ email: profile._json.email }).exec(function(
        userFindOneErr,
        userFindOneData
    ) {
        if (userFindOneErr) return done(null, null);
        if (!userFindOneData) {
            var user = {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            };

            User(user).save((userSaveErr, userSaveData) => {
                if (userSaveErr) return done(null, null);
                User.findById(userSaveData._id)
                    .populate("userGroup")
                    .populate("userType")
                    .populate("userProvider")
                    .exec((userFindErr, userFindData) => {
                        if (userFindErr) return done(null, null);
                        return done(null, userFindData);
                    });
            });
        } else {
            let id = {};

            User.findByIdAndUpdate(
                userFindOneData._id,
                id,
                {
                    new: true
                },
                function(userUpdateErr, userUpdateData) {
                    if (userUpdateErr) return done(null, null);
                    return done(null, userUpdateData);
                }
            );
        }
    });
}
