import { pgTable, serial, varchar, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Achievements Table ─────────────────────────────────────
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  year: integer("year"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);

export type Achievement = z.infer<typeof selectAchievementSchema>;
export type NewAchievement = z.infer<typeof insertAchievementSchema>;
