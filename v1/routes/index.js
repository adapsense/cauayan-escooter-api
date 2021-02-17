const express = require("express");
const router = express.Router();
const auth = require("../routes/auth");
const acl = require("../routes/acl");
const userProviderRouter = require("./userProvider");
const userTypeRouter = require("./userType");
const userGroupRouter = require("./userGroup");
const userStatusRouter = require("./userStatus");
const userRouter = require("./user");
const vehicleTypeRouter = require("./vehicleType");
const vehicleStatusRouter = require("./vehicleStatus");
const vehicleRouter = require("./vehicle");
const vehicleLeaseRouter = require("./vehicleLease");
const vehicleLogRouter = require("./vehicleLog");
const vehicleMessageRouter = require("./vehicleMessage");
const tripRouter = require("./trip");
const geofenceStatusRouter = require("./geofenceStatus");
const geofenceRouter = require("./geofence");
const analyticsTypeRouter = require("./analyticsType");
const analyticsRouter = require("./analytics");
const threadRouter = require("./thread");
const messageRouter = require("./message");
const feedbackRouter = require("./feedback");
const logRouter = require("./log");

router.use(auth);
/*router.use(
    acl.authorize.unless({
        path: [
            process.env.BASE_URL_V1 + "/users/signin",
            process.env.BASE_URL_V1 + "/users/signup",
            {
                url: process.env.BASE_URL_V1 + "/userGroups",
                methods: ["GET"],
            },
            {
                url: process.env.BASE_URL_V1 + "/projects",
                methods: ["POST"],
            },
            {
                url: process.env.BASE_URL_V1 + "/pages",
                methods: ["POST"],
            },
        ],
    })
);*/

router.use("/userProviders", userProviderRouter);
router.use("/userTypes", userTypeRouter);
router.use("/userGroups", userGroupRouter);
router.use("/userStatuses", userStatusRouter);
router.use("/users", userRouter);
router.use("/vehicleTypes", vehicleTypeRouter);
router.use("/vehicleStatuses", vehicleStatusRouter);
router.use("/vehicles", vehicleRouter);
router.use("/vehicleLeases", vehicleLeaseRouter);
router.use("/vehicleLogs", vehicleLogRouter);
router.use("/vehicleMessages", vehicleMessageRouter);
router.use("/trips", tripRouter);
router.use("/geofenceStatuses", geofenceStatusRouter);
router.use("/geofences", geofenceRouter);
router.use("/analyticsTypes", analyticsTypeRouter);
router.use("/analytics", analyticsRouter);
router.use("/threads", threadRouter);
router.use("/messages", messageRouter);
router.use("/feedbacks", feedbackRouter);
router.use("/logs", logRouter);

module.exports = router;

