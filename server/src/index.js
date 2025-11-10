import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDb } from "./lib/db.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.CLIENT_ORIGIN,
].filter(Boolean));

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:", "http:"],
        "script-src": [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://www.googletagmanager.com"
        ],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "connect-src": ["'self'", "https:", "http:"],
        "frame-src": ["'self'", "https://accounts.google.com"],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: Array.from(allowedOrigins),
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Serve static files from the built frontend if present
const clientDistPath = path.resolve(__dirname, "../public");
if (fs.existsSync(clientDistPath)) {
  console.log(`Serving frontend from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
}

// API routes
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// Catch-all handler for client-side routing when build exists
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  if (fs.existsSync(clientDistPath)) {
    return res.sendFile(path.join(clientDistPath, "index.html"));
  }
  return next();
});

app.use((err, _req, res, _next) => {
  // Basic error handler
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });