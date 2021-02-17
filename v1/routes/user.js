const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
require("../../config/passport")(passport);

module.exports = userRouter;

userRouter.get("/", userController.getUsers);

userRouter.post("/", userController.getUsers);

userRouter.post("/search", userController.searchUser);

userRouter.post("/signin", userController.getUser);

userRouter.get("/signin/error", userController.getError);

userRouter.get(
    "/signin/facebook",
    passport.authenticate("facebook", {
        scope: ["public_profile", "email"],
        failureRedirect: "/api/v1/users/signin/error"
    }),
    userController.getUser
);

userRouter.get(
    "/signin/google",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    }),
    userController.getUser
);

userRouter.put("/signup", userController.addUser);

userRouter.patch("/", userController.updateUser);

userRouter.patch("/changePassword", userController.updatePasswordUser);

userRouter.delete("/", userController.deleteUser);
