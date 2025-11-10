import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.use((err, _req, res, _next) => {
  // Basic error handler
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });