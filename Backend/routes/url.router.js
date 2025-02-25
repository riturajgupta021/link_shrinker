import { generateShortUrl, getLongUrl, getUrls } from "../controllers/url.controller.js";
import { checkForToken } from "../middlewares/user.middleware.js";
import { Router } from "express";

const urlRouter = Router();

urlRouter.post("/generate", checkForToken, generateShortUrl);

urlRouter.get("/geturls", checkForToken, getUrls);

urlRouter.get("/:code", getLongUrl);

export { urlRouter };
