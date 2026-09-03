import { pgTable, serial, uuid, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users.js";

// ── Connection Status Enum ─────────────────────────────────
export const connectionStatusEnum = pgEnum("connection_status", [
  "pending",
  "accepted",
  "rejected",
]);

// ── Connections Table ──────────────────────────────────────
export const connections = pgTable(
  "connections",
  {
    id: serial("id").primaryKey(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: connectionStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueConnection: unique().on(t.senderId, t.receiverId),
  })
);

// ── Auto-generated Zod Schemas ──────────────────────────────
export const insertConnectionSchema = createInsertSchema(connections);
export const selectConnectionSchema = createSelectSchema(connections);

export type Connection = z.infer<typeof selectConnectionSchema>;
export type NewConnection = z.infer<typeof insertConnectionSchema>;
