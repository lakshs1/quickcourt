import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import * as usersController from "./users.controller.js";
import { onboardSchema, updateProfileSchema } from "./users.schemas.js";

const router = Router();

// Protect all user routes
router.use(authenticate);

router.get("/me", usersController.getMe);
router.post("/onboard", validate(onboardSchema), usersController.onboard);
router.put("/me", validate(updateProfileSchema), usersController.update);
router.get("/:id", usersController.getPublicProfile);

export default router;
