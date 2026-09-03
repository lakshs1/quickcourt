import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import * as feedService from "./feed.service.js";

export async function getPreview(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await feedService.getPreviewProfiles();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getFeed(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const degree = req.query.degree as string | undefined;
    const year = req.query.year as string | undefined;
    const lookingFor = req.query.lookingFor as string | undefined;

    const data = await feedService.getFeed(req.user!.id, {
      page,
      limit,
      degree,
      year,
      lookingFor,
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function search(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const q = (req.query.q as string) || "";
    const data = await feedService.searchProfiles(req.user!.id, q);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
