const express = require("express");
const analyticsTypeRouter = express.Router();
const analyticsTypeController = require("../controllers/analyticsTypeController");

module.exports = analyticsTypeRouter;

analyticsTypeRouter.get("/", analyticsTypeController.getAnalyticsTypes);

analyticsTypeRouter.post("/", analyticsTypeController.getAnalyticsTypes);

analyticsTypeRouter.put("/", analyticsTypeController.addAnalyticsType);

analyticsTypeRouter.patch("/", analyticsTypeController.updateAnalyticsType);

analyticsTypeRouter.delete("/", analyticsTypeController.deleteAnalyticsType);
