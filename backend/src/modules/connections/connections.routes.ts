import { Router, type Response, type NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as connectionService from "./connections.service.js";
import "./connections.schemas.js";

const router = Router();
router.use(authenticate);

router.post("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      res.status(400).json({ success: false, message: "receiverId is required" });
      return;
    }
    const data = await connectionService.sendConnectionRequest(req.user!.id, receiverId);
    res.status(201).json({ success: true, message: "Connection request sent", data });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await connectionService.listUserConnections(req.user!.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const connectionId = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
      res.status(400).json({ success: false, message: "status must be 'accepted' or 'rejected'" });
      return;
    }
    const data = await connectionService.updateConnectionStatus(req.user!.id, connectionId, status);
    res.json({ success: true, message: `Connection ${status}`, data });
  } catch (error) {
    next(error);
  }
});

export default router;
