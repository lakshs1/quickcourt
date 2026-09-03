import { pgTable, serial, varchar, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Projects Table ─────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export type Project = z.infer<typeof selectProjectSchema>;
export type NewProject = z.infer<typeof insertProjectSchema>;
