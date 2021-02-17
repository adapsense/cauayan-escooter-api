const express = require("express");
const logRouter = express.Router();
const logController = require("../controllers/logController");

module.exports = logRouter;

logRouter.get("/", logController.getLogs);

logRouter.post("/", logController.getLogs);

logRouter.put("/", logController.addLog);

logRouter.patch("/", logController.updateLog);

logRouter.delete("/", logController.deleteLog);
