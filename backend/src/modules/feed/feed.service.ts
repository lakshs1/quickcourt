import { eq, ne, and, ilike, or, sql, inArray } from "drizzle-orm";
import { db } from "../../config/db.js";
import {
  users,
  skills,
  interests,
  userSkills,
  userInterests,
  projects,
  connections,
} from "../../db/schema/index.js";
import { getFullProfile } from "../users/users.service.js";

/**
 * Fetch 5 preview student profiles for public unauthenticated landing page.
 */
export async function getPreviewProfiles() {
  const previewUsers = await db
    .select({
      id: users.id,
      name: users.name,
      degree: users.degree,
      year: users.year,
      lookingFor: users.lookingFor,
      photoUrl: users.photoUrl,
    })
    .from(users)
    .where(eq(users.hasOnboarded, true))
    .limit(5);

  const result = [];
  for (const u of previewUsers) {
    const userSkillRows = await db
      .select({ id: skills.id, name: skills.name })
      .from(userSkills)
      .innerJoin(skills, eq(userSkills.skillId, skills.id))
      .where(eq(userSkills.userId, u.id))
      .limit(4);

    const userInterestRows = await db
      .select({ id: interests.id, name: interests.name })
      .from(userInterests)
      .innerJoin(interests, eq(userInterests.interestId, interests.id))
      .where(eq(userInterests.userId, u.id))
      .limit(3);

    result.push({
      ...u,
      skills: userSkillRows,
      interests: userInterestRows,
    });
  }

  return result;
}

export interface FeedQueryOptions {
  page?: number;
  limit?: number;
  degree?: string;
  year?: string;
  skill?: string;
  interest?: string;
  lookingFor?: string;
}

/**
 * Fetch paginated feed for authenticated user.
 */
export async function getFeed(currentUserId: string, options: FeedQueryOptions) {
  const page = Math.max(1, options.page || 1);
  const limit = options.limit || 5;
  const offset = (page - 1) * limit;

  const conditions = [ne(users.id, currentUserId), eq(users.hasOnboarded, true)];

  if (options.degree) {
    conditions.push(ilike(users.degree, `%${options.degree.trim()}%`));
  }
  if (options.year) {
    conditions.push(ilike(users.year, `%${options.year.trim()}%`));
  }
  if (options.lookingFor) {
    conditions.push(ilike(users.lookingFor, `%${options.lookingFor.trim()}%`));
  }

  const baseQuery = db
    .select({ id: users.id })
    .from(users)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  const targetUserIds = (await baseQuery).map((u) => u.id);

  if (targetUserIds.length === 0) {
    return {
      profiles: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  // Fetch full profiles
  const profiles = [];
  for (const tid of targetUserIds) {
    const full = await getFullProfile(tid);

    // Check connection status with current user
    const [conn] = await db
      .select()
      .from(connections)
      .where(
        or(
          and(eq(connections.senderId, currentUserId), eq(connections.receiverId, tid)),
          and(eq(connections.senderId, tid), eq(connections.receiverId, currentUserId))
        )
      )
      .limit(1);

    const connectionStatus = conn ? conn.status : "none";
    const isSender = conn ? conn.senderId === currentUserId : false;

    profiles.push({
      ...full,
      connectionStatus,
      isSender,
    });
  }

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(and(...conditions));

  const total = Number(count);
  const totalPages = Math.ceil(total / limit);

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Search profiles matching query string across name, skills, interests, projects, lookingFor.
 */
export async function searchProfiles(currentUserId: string, query: string) {
  if (!query || !query.trim()) {
    return getFeed(currentUserId, { page: 1, limit: 10 });
  }

  const q = `%${query.trim()}%`;

  const matchedUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        ne(users.id, currentUserId),
        eq(users.hasOnboarded, true),
        or(
          ilike(users.name, q),
          ilike(users.degree, q),
          ilike(users.bio, q),
          ilike(users.lookingFor, q)
        )
      )
    )
    .limit(20);

  const matchedIds = matchedUsers.map((u) => u.id);

  const profiles = [];
  for (const id of matchedIds) {
    const full = await getFullProfile(id);
    profiles.push(full);
  }

  return { profiles };
}
