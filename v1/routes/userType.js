const express = require("express");
const userTypeRouter = express.Router();
const userTypeController = require("../controllers/userTypeController");

module.exports = userTypeRouter;

userTypeRouter.get("/", userTypeController.getUserTypes);

userTypeRouter.post("/", userTypeController.getUserTypes);

userTypeRouter.put("/", userTypeController.addUserType);

userTypeRouter.patch("/", userTypeController.updateUserType);

userTypeRouter.delete("/", userTypeController.deleteUserType);
