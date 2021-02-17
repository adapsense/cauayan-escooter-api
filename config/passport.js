var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require("../v1/models/User");
var config = require("../config/database");

var FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

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

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL,
                profileFields: ["id", "emails", "name", "photos"]
            },
            function(token, refreshToken, profile, done) {
                process.nextTick(function() {
                    signin(profile, done);
                });
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            (token, refreshToken, profile, done) => {
                signin(profile, done);
            }
        )
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

            if (profile.provider == "facebook") {
                user.facebookId = profile.id;
            } else {
                user.googleId = profile.id;
            }

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
            if (profile.provider == "facebook") {
                id = {
                    facebookId: profile.id
                };
            } else {
                id = {
                    googleId: profile.id
                };
            }

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
