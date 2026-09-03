import { Router, type Response, type NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as bookmarkService from "./bookmarks.service.js";
import "./bookmarks.schemas.js";

const router = Router();
router.use(authenticate);

router.post("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { bookmarkedUserId } = req.body;
    if (!bookmarkedUserId) {
      res.status(400).json({ success: false, message: "bookmarkedUserId is required" });
      return;
    }
    const data = await bookmarkService.addBookmark(req.user!.id, bookmarkedUserId);
    res.status(201).json({ success: true, message: "Profile bookmarked", data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:bookmarkedUserId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { bookmarkedUserId } = req.params;
    const data = await bookmarkService.removeBookmark(req.user!.id, bookmarkedUserId);
    res.json({ success: true, message: "Bookmark removed", data });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await bookmarkService.listBookmarks(req.user!.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
