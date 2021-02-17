const jwt = require("jsonwebtoken");
var config = require("../../config/database");

module.exports = function(req, res, next) {
    let url = req.url;

    const token = getToken(req.headers);
    if(token) {
        try {
            const decoded = jwt.verify(token, config.secret);
            req.user = decoded;
        } catch (ex) {
            console.log(ex);
        }
    }

    if (
        url.includes("users/search") ||
        url.includes("users/signin") ||
        url.includes("users/signup") ||
        url.includes("vehicles/search")
    ) {
        next();
    } else {
        if (!token)
            return res
                .status(403)
                .send({ success: false, error: "Unauthorized." });
        next();
    }
};

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(" ");
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
