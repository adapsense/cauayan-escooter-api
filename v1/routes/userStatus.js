const express = require("express");
const userStatusRouter = express.Router();
const userStatusController = require("../controllers/userStatusController");

module.exports = userStatusRouter;

userStatusRouter.get("/", userStatusController.getUserStatuses);

userStatusRouter.post("/", userStatusController.getUserStatuses);

userStatusRouter.put("/", userStatusController.addUserStatus);

userStatusRouter.patch("/", userStatusController.updateUserStatus);

userStatusRouter.delete("/", userStatusController.deleteUserStatus);
