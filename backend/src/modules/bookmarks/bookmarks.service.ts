import { eq, and } from "drizzle-orm";
import { db } from "../../config/db.js";
import { bookmarks, users } from "../../db/schema/index.js";
import { ApiError } from "../../lib/api-error.js";
import { getFullProfile } from "../users/users.service.js";

export async function addBookmark(userId: string, bookmarkedUserId: string) {
  if (userId === bookmarkedUserId) {
    throw ApiError.badRequest("You cannot bookmark your own profile");
  }

  const [target] = await db
    .select()
    .from(users)
    .where(eq(users.id, bookmarkedUserId))
    .limit(1);

  if (!target) {
    throw ApiError.notFound("Profile to bookmark not found");
  }

  await db
    .insert(bookmarks)
    .values({
      userId,
      bookmarkedUserId,
    })
    .onConflictDoNothing();

  return { bookmarkedUserId };
}

export async function removeBookmark(userId: string, bookmarkedUserId: string) {
  await db
    .delete(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.bookmarkedUserId, bookmarkedUserId)
      )
    );

  return { bookmarkedUserId };
}

export async function listBookmarks(userId: string) {
  const userBookmarks = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));

  const bookmarkedProfiles = [];
  for (const bm of userBookmarks) {
    const profile = await getFullProfile(bm.bookmarkedUserId);
    bookmarkedProfiles.push({
      profile,
      bookmarkedAt: bm.createdAt,
    });
  }

  return bookmarkedProfiles;
}
