import { pgTable, serial, varchar, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Social Links Table ─────────────────────────────────────
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 50 }).notNull(),
  url: text("url").notNull(),
});

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertSocialLinkSchema = createInsertSchema(socialLinks);
export const selectSocialLinkSchema = createSelectSchema(socialLinks);

export type SocialLink = z.infer<typeof selectSocialLinkSchema>;
export type NewSocialLink = z.infer<typeof insertSocialLinkSchema>;
