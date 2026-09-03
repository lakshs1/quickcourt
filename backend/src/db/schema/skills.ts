import { pgTable, serial, varchar, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Global Skills Catalog ──────────────────────────────────
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }),
});

// ── User Skills Join Table ──────────────────────────────────
export const userSkills = pgTable(
  "user_skills",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    skillId: serial("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.skillId] }),
  })
);

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);
export const insertUserSkillSchema = createInsertSchema(userSkills);
export const selectUserSkillSchema = createSelectSchema(userSkills);

export type Skill = z.infer<typeof selectSkillSchema>;
export type NewSkill = z.infer<typeof insertSkillSchema>;
export type UserSkill = z.infer<typeof selectUserSkillSchema>;
