const acl = require("express-acl");
const UserType = require("../models/UserType");

UserType.find().exec(function(err, data) {
    if (err) console.log(err);
    const rules = [];
    data.forEach(function(userType) {
        var rule = {
            group: userType.name,
            permissions: [
                {
                    resource: "*",
                    methods: "*",
                    //resource: "users/*",
                    //methods: ["POST", "PUT"],
                    action: "allow"
                }
            ]
        };
        rules.push(rule);
    });

    let configObject = {
        rules: rules,
        decodedObjectName: "user",
        roleSearchPath: "user.userType.name",
        denyCallback: res => {
            return res.status(403).json({
                success: false,
                error: "Unauthorized."
            });
        }
    };
    acl.config(configObject);
});

module.exports = acl;
