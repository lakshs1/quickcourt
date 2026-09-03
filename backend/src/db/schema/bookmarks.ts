import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Bookmarks Table ────────────────────────────────────────
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookmarkedUserId: uuid("bookmarked_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.bookmarkedUserId] }),
  })
);

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertBookmarkSchema = createInsertSchema(bookmarks);
export const selectBookmarkSchema = createSelectSchema(bookmarks);

export type Bookmark = z.infer<typeof selectBookmarkSchema>;
export type NewBookmark = z.infer<typeof insertBookmarkSchema>;
