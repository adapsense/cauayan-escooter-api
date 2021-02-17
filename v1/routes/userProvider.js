const express = require("express");
const userProviderRouter = express.Router();
const userProviderController = require("../controllers/userProviderController");

module.exports = userProviderRouter;

userProviderRouter.get("/", userProviderController.getUserProviders);

userProviderRouter.post("/", userProviderController.getUserProviders);

userProviderRouter.put("/", userProviderController.addUserProvider);

userProviderRouter.patch("/", userProviderController.updateUserProvider);

userProviderRouter.delete("/", userProviderController.deleteUserProvider);
