import { pgTable, serial, varchar, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Global Interests Catalog ───────────────────────────────
export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

// ── User Interests Join Table ──────────────────────────────
export const userInterests = pgTable(
  "user_interests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    interestId: serial("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.interestId] }),
  })
);

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertInterestSchema = createInsertSchema(interests);
export const selectInterestSchema = createSelectSchema(interests);
export const insertUserInterestSchema = createInsertSchema(userInterests);
export const selectUserInterestSchema = createSelectSchema(userInterests);

export type Interest = z.infer<typeof selectInterestSchema>;
export type NewInterest = z.infer<typeof insertInterestSchema>;
export type UserInterest = z.infer<typeof selectUserInterestSchema>;
