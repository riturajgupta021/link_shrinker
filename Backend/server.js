import { connectToDatabase } from "./dbConnection.js";
import { userRouter } from "./routes/user.router.js";
import {urlRouter} from "./routes/url.router.js"
import { redis } from "./redisConnection.js";
import cookieParser from "cookie-parser"
import express from "express";
import cron from "node-cron";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

const frontendUrl = "https://linkshrinker.netlify.app";

const corsOptions = {
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

cron.schedule("0 0 0 * * *", async () => {
  const counter = await redis.get("counter");
  await redis.flushdb();
  await redis.set("counter", counter);
},{timezone: "Asia/Kolkata"})

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.get("/health", (req,res) => {
  res.send("healthy")
})

app.use("/user", userRouter);

app.use(urlRouter);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running at http://localhost:${PORT}`);
});