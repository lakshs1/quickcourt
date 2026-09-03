import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import * as userService from "./users.service.js";

export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await userService.getFullProfile(req.user!.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function onboard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await userService.onboardUser(req.user!.id, req.body);
    res.json({
      success: true,
      message: "Onboarding completed successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await userService.updateProfile(req.user!.id, req.body);
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await userService.getFullProfile(req.params.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
