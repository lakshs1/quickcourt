import { eq, inArray } from "drizzle-orm";
import { db } from "../../config/db.js";
import {
  users,
  skills,
  interests,
  userSkills,
  userInterests,
  projects,
  achievements,
  socialLinks,
} from "../../db/schema/index.js";
import { ApiError } from "../../lib/api-error.js";

export interface OnboardData {
  degree: string;
  year: string;
  bio?: string;
  about?: string;
  photoUrl?: string;
  location?: string;
  availability?: string;
  lookingFor: string;
  skills: string[]; // skill names
  interests?: string[]; // interest names
  projects?: {
    title: string;
    description?: string;
    techStack?: string[];
    githubUrl?: string;
    demoUrl?: string;
  }[];
  achievements?: {
    title: string;
    organization?: string;
    year?: number;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

/**
 * Fetch full profile for a given user ID with all relations.
 */
export async function getFullProfile(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // Fetch Skills
  const userSkillRows = await db
    .select({
      id: skills.id,
      name: skills.name,
      category: skills.category,
    })
    .from(userSkills)
    .innerJoin(skills, eq(userSkills.skillId, skills.id))
    .where(eq(userSkills.userId, userId));

  // Fetch Interests
  const userInterestRows = await db
    .select({
      id: interests.id,
      name: interests.name,
    })
    .from(userInterests)
    .innerJoin(interests, eq(userInterests.interestId, interests.id))
    .where(eq(userInterests.userId, userId));

  // Fetch Projects
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));

  // Fetch Achievements
  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId));

  // Fetch Social Links
  const userSocialLinks = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.userId, userId));

  const { password, refreshToken, verificationToken, resetToken, resetTokenExpiry, ...safeUser } = user;

  return {
    ...safeUser,
    skills: userSkillRows,
    interests: userInterestRows,
    projects: userProjects,
    achievements: userAchievements,
    socialLinks: userSocialLinks,
  };
}

/**
 * Sync skills for a user by list of names.
 */
async function syncUserSkills(userId: string, skillNames: string[]) {
  // Clear existing skills for user
  await db.delete(userSkills).where(eq(userSkills.userId, userId));

  if (!skillNames || skillNames.length === 0) return;

  const normalizedNames = [...new Set(skillNames.map((s) => s.trim().toLowerCase()))];

  for (const name of normalizedNames) {
    if (!name) continue;
    let [existingSkill] = await db
      .select()
      .from(skills)
      .where(eq(skills.name, name))
      .limit(1);

    if (!existingSkill) {
      [existingSkill] = await db.insert(skills).values({ name }).returning();
    }

    await db
      .insert(userSkills)
      .values({ userId, skillId: existingSkill.id })
      .onConflictDoNothing();
  }
}

/**
 * Sync interests for a user by list of names.
 */
async function syncUserInterests(userId: string, interestNames: string[]) {
  // Clear existing interests for user
  await db.delete(userInterests).where(eq(userInterests.userId, userId));

  if (!interestNames || interestNames.length === 0) return;

  const normalizedNames = [...new Set(interestNames.map((i) => i.trim().toLowerCase()))];

  for (const name of normalizedNames) {
    if (!name) continue;
    let [existingInterest] = await db
      .select()
      .from(interests)
      .where(eq(interests.name, name))
      .limit(1);

    if (!existingInterest) {
      [existingInterest] = await db.insert(interests).values({ name }).returning();
    }

    await db
      .insert(userInterests)
      .values({ userId, interestId: existingInterest.id })
      .onConflictDoNothing();
  }
}

/**
 * Complete user onboarding.
 */
export async function onboardUser(userId: string, data: OnboardData) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // Update user main info
  await db
    .update(users)
    .set({
      degree: data.degree,
      year: data.year,
      bio: data.bio,
      about: data.about,
      photoUrl: data.photoUrl,
      location: data.location,
      availability: data.availability,
      lookingFor: data.lookingFor,
      hasOnboarded: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // Sync Skills & Interests
  if (data.skills) {
    await syncUserSkills(userId, data.skills);
  }
  if (data.interests) {
    await syncUserInterests(userId, data.interests);
  }

  // Sync Projects
  if (data.projects) {
    await db.delete(projects).where(eq(projects.userId, userId));
    for (const p of data.projects) {
      await db.insert(projects).values({
        userId,
        title: p.title,
        description: p.description,
        techStack: p.techStack || [],
        githubUrl: p.githubUrl,
        demoUrl: p.demoUrl,
      });
    }
  }

  // Sync Achievements
  if (data.achievements) {
    await db.delete(achievements).where(eq(achievements.userId, userId));
    for (const a of data.achievements) {
      await db.insert(achievements).values({
        userId,
        title: a.title,
        organization: a.organization,
        year: a.year,
      });
    }
  }

  // Sync Social Links
  if (data.socialLinks) {
    await db.delete(socialLinks).where(eq(socialLinks.userId, userId));
    for (const s of data.socialLinks) {
      await db.insert(socialLinks).values({
        userId,
        platform: s.platform,
        url: s.url,
      });
    }
  }

  return getFullProfile(userId);
}

/**
 * Update profile details for a user.
 */
export async function updateProfile(userId: string, data: Partial<OnboardData> & { name?: string }) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (data.name !== undefined) updates.name = data.name;
  if (data.degree !== undefined) updates.degree = data.degree;
  if (data.year !== undefined) updates.year = data.year;
  if (data.bio !== undefined) updates.bio = data.bio;
  if (data.about !== undefined) updates.about = data.about;
  if (data.photoUrl !== undefined) updates.photoUrl = data.photoUrl;
  if (data.location !== undefined) updates.location = data.location;
  if (data.availability !== undefined) updates.availability = data.availability;
  if (data.lookingFor !== undefined) updates.lookingFor = data.lookingFor;

  await db.update(users).set(updates).where(eq(users.id, userId));

  if (data.skills !== undefined) {
    await syncUserSkills(userId, data.skills);
  }
  if (data.interests !== undefined) {
    await syncUserInterests(userId, data.interests);
  }

  if (data.projects !== undefined) {
    await db.delete(projects).where(eq(projects.userId, userId));
    for (const p of data.projects) {
      await db.insert(projects).values({
        userId,
        title: p.title,
        description: p.description,
        techStack: p.techStack || [],
        githubUrl: p.githubUrl,
        demoUrl: p.demoUrl,
      });
    }
  }

  if (data.achievements !== undefined) {
    await db.delete(achievements).where(eq(achievements.userId, userId));
    for (const a of data.achievements) {
      await db.insert(achievements).values({
        userId,
        title: a.title,
        organization: a.organization,
        year: a.year,
      });
    }
  }

  if (data.socialLinks !== undefined) {
    await db.delete(socialLinks).where(eq(socialLinks.userId, userId));
    for (const s of data.socialLinks) {
      await db.insert(socialLinks).values({
        userId,
        platform: s.platform,
        url: s.url,
      });
    }
  }

  return getFullProfile(userId);
}
