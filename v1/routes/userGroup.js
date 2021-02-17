const express = require("express");
const userGroupRouter = express.Router();
const userGroupController = require("../controllers/userGroupController");

module.exports = userGroupRouter;

userGroupRouter.get("/", userGroupController.getUserGroups);

userGroupRouter.post("/", userGroupController.getUserGroups);

userGroupRouter.put("/", userGroupController.addUserGroup);

userGroupRouter.patch("/", userGroupController.updateUserGroup);

userGroupRouter.delete("/", userGroupController.deleteUserGroup);
