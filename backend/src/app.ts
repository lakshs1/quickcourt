import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import pino from "pino";
import { env } from "./config/env.js";
import { setupSwagger } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";

// ── Import route modules ──────────────────────────────────
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import catalogRoutes from "./modules/catalog/catalog.routes.js";
import feedRoutes from "./modules/feed/feed.routes.js";
import connectionsRoutes from "./modules/connections/connections.routes.js";
import bookmarksRoutes from "./modules/bookmarks/bookmarks.routes.js";
import roadmapsRoutes from "./modules/roadmaps/roadmaps.routes.js";

// ── Logger ────────────────────────────────────────────────
const logger = pino({
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

// ── Express app ───────────────────────────────────────────
const app = express();

// ── Global middleware ─────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

// ── Swagger ───────────────────────────────────────────────
setupSwagger(app);

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════
// ROUTE MODULES
// ═══════════════════════════════════════════════════════════
app.use("/api/v1/auth", authRoutes);
app.use("/api/auth", authRoutes); // backward compatibility alias

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/catalog", catalogRoutes);
app.use("/api/v1/skills", (req, res, next) => {
  req.url = "/skills" + (req.url === "/" ? "" : req.url);
  catalogRoutes(req, res, next);
});
app.use("/api/v1/interests", (req, res, next) => {
  req.url = "/interests" + (req.url === "/" ? "" : req.url);
  catalogRoutes(req, res, next);
});

app.use("/api/v1", feedRoutes);
app.use("/api/v1/connections", connectionsRoutes);
app.use("/api/v1/bookmarks", bookmarksRoutes);
app.use("/api/v1/roadmaps", roadmapsRoutes);

// ── Error handler (must be last) ──────────────────────────
app.use(errorHandler);

export { app, logger };
