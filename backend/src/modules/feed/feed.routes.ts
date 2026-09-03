import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as feedController from "./feed.controller.js";
import "./feed.schemas.js";

const router = Router();

// Public route for landing page preview
router.get("/preview/profiles", feedController.getPreview);

// Authenticated routes
router.get("/feed", authenticate, feedController.getFeed);
router.get("/feed/search", authenticate, feedController.search);

export default router;
