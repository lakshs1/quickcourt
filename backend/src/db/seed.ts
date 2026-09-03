import { db } from "../config/db.js";
import {
  users,
  skills,
  interests,
  userSkills,
  userInterests,
  projects,
  achievements,
  socialLinks,
} from "./schema/index.js";
import { hashPassword } from "../lib/password.js";
import { eq } from "drizzle-orm";

const DEFAULT_SKILLS = [
  { name: "python", category: "language" },
  { name: "javascript", category: "language" },
  { name: "typescript", category: "language" },
  { name: "react", category: "framework" },
  { name: "node.js", category: "framework" },
  { name: "express", category: "framework" },
  { name: "fastapi", category: "framework" },
  { name: "postgresql", category: "tool" },
  { name: "figma", category: "creative" },
  { name: "ui/ux design", category: "creative" },
  { name: "docker", category: "tool" },
  { name: "git", category: "tool" },
  { name: "ai/ml", category: "domain" },
  { name: "pytorch", category: "framework" },
  { name: "langchain", category: "framework" },
  { name: "video editing", category: "creative" },
  { name: "content writing", category: "creative" },
  { name: "graphic design", category: "creative" },
];

const DEFAULT_INTERESTS = [
  "football", "cricket", "basketball", "badminton", "table tennis",
  "swimming", "running", "fitness", "yoga", "music", "singing",
  "guitar", "piano", "dance", "photography", "videography", "reel making",
  "graphic design", "art", "sketching", "writing", "blogging", "poetry",
  "reading", "anime", "gaming", "chess", "debate", "mun",
  "public speaking", "cooking", "travel", "volunteering", "entrepreneurship",
  "investing", "podcasting"
];

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Skills Catalog
  console.log("  📦 Seeding skills catalog...");
  for (const s of DEFAULT_SKILLS) {
    const existing = await db
      .select()
      .from(skills)
      .where(eq(skills.name, s.name))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(skills).values(s);
    }
  }

  // 2. Seed Interests Catalog
  console.log("  🎨 Seeding interests catalog...");
  for (const name of DEFAULT_INTERESTS) {
    const existing = await db
      .select()
      .from(interests)
      .where(eq(interests.name, name))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(interests).values({ name });
    }
  }

  // 3. Seed Demo Amity Students
  console.log("  👥 Seeding demo Amity students...");
  const hashedPassword = await hashPassword("amity123");

  const demoUsers = [
    {
      name: "Rohan Verma",
      email: "rohan.verma@s.amity.edu",
      degree: "BCA",
      year: "2nd Year",
      bio: "Building AI solutions that solve real world problems.",
      about: "Passionate about AI, backend systems and solving real world problems.",
      location: "Noida, India",
      availability: "Evenings",
      lookingFor: "Backend dev for an AI legal assistant project",
      hasOnboarded: true,
      skills: ["python", "fastapi", "postgresql", "ai/ml"],
      interests: ["cricket", "gaming", "photography"],
      projects: [
        {
          title: "AI Legal Agent",
          description: "LLM based assistant for Indian law",
          techStack: ["Python", "FastAPI", "PostgreSQL"],
          githubUrl: "https://github.com/rohan/ai-legal",
        },
      ],
      achievements: [
        { title: "Winner — Amity Ideathon 2025", organization: "Amity", year: 2025 },
      ],
      socials: [
        { platform: "github", url: "https://github.com/rohan" },
        { platform: "linkedin", url: "https://linkedin.com/in/rohan" },
      ],
    },
    {
      name: "Ananya Sharma",
      email: "ananya.sharma@s.amity.edu",
      degree: "BTech (CSE)",
      year: "3rd Year",
      bio: "Frontend engineer & UI/UX enthusiast.",
      about: "Loves crafting accessible web applications and micro-animations.",
      location: "Noida, India",
      availability: "Weekends",
      lookingFor: "Fullstack collaborator for hackathons",
      hasOnboarded: true,
      skills: ["react", "typescript", "figma", "ui/ux design"],
      interests: ["music", "dance", "design", "reading"],
      projects: [
        {
          title: "AmiConnect UI",
          description: "Clean student networking portal UI",
          techStack: ["React", "TypeScript", "Tailwind"],
        },
      ],
      achievements: [
        { title: "Top 5 — Smart India Hackathon", organization: "SIH", year: 2024 },
      ],
      socials: [
        { platform: "github", url: "https://github.com/ananya" },
      ],
    },
  ];

  const dbSkills = await db.select().from(skills);
  const dbInterests = await db.select().from(interests);

  const skillMap = new Map(dbSkills.map((s) => [s.name, s.id]));
  const interestMap = new Map(dbInterests.map((i) => [i.name, i.id]));

  for (const u of demoUsers) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, u.email))
      .limit(1);

    let userId: string;

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(users)
        .values({
          email: u.email,
          password: hashedPassword,
          name: u.name,
          degree: u.degree,
          year: u.year,
          bio: u.bio,
          about: u.about,
          location: u.location,
          availability: u.availability,
          lookingFor: u.lookingFor,
          hasOnboarded: u.hasOnboarded,
          emailVerified: true,
        })
        .returning();
      userId = inserted.id;
      console.log(`  ✅ Created user ${u.name} (${u.email})`);
    } else {
      userId = existing[0].id;
      console.log(`  ⏭️  User ${u.name} already exists`);
    }

    // Attach user skills
    for (const sk of u.skills) {
      const sId = skillMap.get(sk);
      if (sId) {
        await db
          .insert(userSkills)
          .values({ userId, skillId: sId })
          .onConflictDoNothing();
      }
    }

    // Attach user interests
    for (const intr of u.interests) {
      const iId = interestMap.get(intr);
      if (iId) {
        await db
          .insert(userInterests)
          .values({ userId, interestId: iId })
          .onConflictDoNothing();
      }
    }

    // Attach projects
    for (const p of u.projects) {
      await db
        .insert(projects)
        .values({
          userId,
          title: p.title,
          description: p.description,
          techStack: p.techStack,
          githubUrl: p.githubUrl,
        });
    }

    // Attach achievements
    for (const a of u.achievements) {
      await db
        .insert(achievements)
        .values({
          userId,
          title: a.title,
          organization: a.organization,
          year: a.year,
        });
    }

    // Attach socials
    for (const soc of u.socials) {
      await db
        .insert(socialLinks)
        .values({
          userId,
          platform: soc.platform,
          url: soc.url,
        });
    }
  }

  console.log("🌱 Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
