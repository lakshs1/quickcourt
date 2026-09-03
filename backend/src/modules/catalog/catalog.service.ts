import { db } from "../../config/db.js";
import { skills, interests } from "../../db/schema/index.js";
import { ilike } from "drizzle-orm";

export async function getSkills(searchQuery?: string) {
  if (searchQuery) {
    return db
      .select()
      .from(skills)
      .where(ilike(skills.name, `%${searchQuery.trim()}%`))
      .limit(20);
  }
  return db.select().from(skills).limit(100);
}

export async function getInterests(searchQuery?: string) {
  if (searchQuery) {
    return db
      .select()
      .from(interests)
      .where(ilike(interests.name, `%${searchQuery.trim()}%`))
      .limit(20);
  }
  return db.select().from(interests).limit(100);
}
