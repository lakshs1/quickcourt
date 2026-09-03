import { Router, type Request, type Response, type NextFunction } from "express";
import * as catalogService from "./catalog.service.js";
import "./catalog.schemas.js";

const router = Router();

router.get("/skills", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string | undefined;
    const data = await catalogService.getSkills(q);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/interests", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string | undefined;
    const data = await catalogService.getInterests(q);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
