import { Router, type Response, type NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getFullProfile } from "../users/users.service.js";
import "./roadmaps.schemas.js";

const router = Router();
router.use(authenticate);

const SKILL_ADJACENCY_MAP: Record<
  string,
  { suggested: string; reason: string; resources: { title: string; url: string }[] }
> = {
  react: {
    suggested: "TypeScript",
    reason: "Enhance code reliability and type safety in frontend applications",
    resources: [
      { title: "TypeScript Official Documentation", url: "https://www.typescriptlang.org/docs/" },
      { title: "React TypeScript CheatSheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
    ],
  },
  python: {
    suggested: "FastAPI",
    reason: "Build high-performance backend REST & async APIs",
    resources: [
      { title: "FastAPI Official Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
    ],
  },
  javascript: {
    suggested: "Node.js & Express",
    reason: "Expand into scalable full-stack backend web development",
    resources: [
      { title: "Node.js Getting Started Guide", url: "https://nodejs.org/en/docs/guides/" },
    ],
  },
  figma: {
    suggested: "UI/UX Design Systems",
    reason: "Master scalable design tokens and accessible component design",
    resources: [
      { title: "Figma Official Design Systems Guide", url: "https://www.figma.com/best-practices/guide-to-design-systems/" },
    ],
  },
};

router.get("/me", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await getFullProfile(req.user!.id);
    const userSkillNames = (profile.skills || []).map((s) => s.name.toLowerCase());

    const suggestions: { currentSkill: string; suggestedSkill: string; reason: string; resources: { title: string; url: string }[] }[] = [];

    for (const skillName of userSkillNames) {
      if (SKILL_ADJACENCY_MAP[skillName]) {
        const item = SKILL_ADJACENCY_MAP[skillName];
        suggestions.push({
          currentSkill: skillName,
          suggestedSkill: item.suggested,
          reason: item.reason,
          resources: item.resources,
        });
      }
    }

    // Default fallback if no specific match
    if (suggestions.length === 0) {
      suggestions.push({
        currentSkill: "General",
        suggestedSkill: "Git & Web Fundamentals",
        reason: "Essential foundation for collaborative team projects at Amity",
        resources: [
          { title: "Git Documentation", url: "https://git-scm.com/doc" },
          { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        ],
      });
    }

    res.json({
      success: true,
      data: {
        goal: profile.lookingFor || "Set your goal in your profile to get personalized suggestions.",
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
