const express = require("express");
const threadRouter = express.Router();
const threadController = require("../controllers/threadController");

module.exports = threadRouter;

threadRouter.get("/", threadController.getThreads);

threadRouter.post("/", threadController.getThreads);

threadRouter.put("/", threadController.addThread);

threadRouter.patch("/", threadController.updateThread);

threadRouter.delete("/", threadController.deleteThread);
