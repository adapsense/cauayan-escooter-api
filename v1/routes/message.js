const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");

module.exports = messageRouter;

messageRouter.get("/", messageController.getMessages);

messageRouter.post("/", messageController.getMessages);

messageRouter.put("/", messageController.addMessage);

messageRouter.patch("/", messageController.updateMessage);

messageRouter.patch("/seen", messageController.seenMessage);

messageRouter.delete("/", messageController.deleteMessage);
