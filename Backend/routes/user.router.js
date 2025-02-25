import { login, signUp } from "../controllers/user.controller.js";
import { checkForToken } from "../middlewares/user.middleware.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/signup", signUp);

userRouter.post("/login", login);

userRouter.use(checkForToken);

userRouter.get("/", async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success:true, name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ suceess: false, message: "User not Signed in" });
    }
})

export { userRouter };