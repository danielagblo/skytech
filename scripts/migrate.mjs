import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const mysqlMod = await import('../app/lib/mysql.ts');
const SCHEMA = mysqlMod.SCHEMA ?? mysqlMod.default?.SCHEMA ?? [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const {
  MONGODB_URI,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  console.error("MySQL configuration is missing (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE).");
  process.exit(1);
}

const pool = mysql.createPool({
  host: MYSQL_HOST || "localhost",
  port: parseInt(MYSQL_PORT || "3306", 10),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD || "",
  database: MYSQL_DATABASE,
  connectionLimit: 5,
});

async function createSchema() {
  console.log("Creating MySQL schema (idempotent)...");
  for (const ddl of SCHEMA) {
    await pool.query(ddl);
  }
  console.log("Schema ready.");
}

async function sync() {
  if (!MONGODB_URI) {
    console.log("MONGODB_URI not set — skipping data copy from MongoDB.");
    return;
  }
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const docs = (coll) => db.collection(coll).find({}).toArray();

  // Hero
  const heroList = await docs("heros");
  if (heroList.length > 0) {
    await pool.query("DELETE FROM hero");
    for (const h of heroList) {
      await pool.query(
        "INSERT INTO hero (id, title, subtitle, image_url, headline, headline_sub, sub_text, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [String(h._id), h.title || "", h.subtitle || "", h.imageUrl || "", h.headline || "", h.headlineSub || "", h.subText || "", JSON.stringify(h.stats || [])],
      );
    }
    console.log(`Synced hero (${heroList.length})`);
  }

  // Pricing
  const pricingList = await docs("pricings");
  if (pricingList.length > 0) {
    await pool.query("DELETE FROM pricing");
    for (const p of pricingList) {
      await pool.query(
        "INSERT INTO pricing (id, category, label, packages) VALUES (?, ?, ?, ?)",
        [String(p._id), p.category, p.label || p.category || "", JSON.stringify(p.packages || [])],
      );
    }
    console.log(`Synced pricing (${pricingList.length})`);
  }

  // Projects
  const projectList = await docs("projects");
  if (projectList.length > 0) {
    await pool.query("DELETE FROM projects");
    for (const pr of projectList) {
      await pool.query(
        "INSERT INTO projects (id, title, category, description, image, client, impact, metrics, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          String(pr._id),
          pr.title || "",
          pr.category || "",
          pr.description || "",
          pr.image || "/images/hero-1.png",
          pr.client || "Global Client",
          pr.impact || "Accelerated Growth",
          JSON.stringify(pr.metrics || []),
          pr.order ?? 0,
          pr.createdAt ? new Date(pr.createdAt) : new Date(),
          pr.updatedAt ? new Date(pr.updatedAt) : new Date(),
        ],
      );
    }
    console.log(`Synced projects (${projectList.length})`);
  }

  // Testimonials
  const tList = await docs("testimonials");
  if (tList.length > 0) {
    await pool.query("DELETE FROM testimonials");
    for (const t of tList) {
      await pool.query(
        "INSERT INTO testimonials (id, author, company, quote, rating) VALUES (?, ?, ?, ?, ?)",
        [String(t._id), t.author || "", t.company || "", t.quote || "", t.rating ?? 5],
      );
    }
    console.log(`Synced testimonials (${tList.length})`);
  }

  // Team members
  const teamList = await docs("teammembers");
  if (teamList.length > 0) {
    await pool.query("DELETE FROM team_members");
    for (const m of teamList) {
      await pool.query(
        "INSERT INTO team_members (id, name, role, bio, image_url, icon_type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [String(m._id), m.name || "", m.role || "", m.bio || "", m.imageUrl || null, m.iconType || "default", m.order ?? 0],
      );
    }
    console.log(`Synced team members (${teamList.length})`);
  }

  // FAQs
  const faqList = await docs("faqs");
  if (faqList.length > 0) {
    await pool.query("DELETE FROM faqs");
    for (const f of faqList) {
      await pool.query(
        "INSERT INTO faqs (id, question, answer, category, sort_order, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [String(f._id), f.question || "", f.answer || "", f.category || "General", f.order ?? 0, f.published ? 1 : 0, f.createdAt ? new Date(f.createdAt) : new Date(), f.updatedAt ? new Date(f.updatedAt) : new Date()],
      );
    }
    console.log(`Synced FAQs (${faqList.length})`);
  }

  // Affiliates
  const affList = await docs("affiliates");
  if (affList.length > 0) {
    await pool.query("DELETE FROM affiliates");
    for (const a of affList) {
      await pool.query(
        "INSERT INTO affiliates (id, name, logo_url, sort_order, created_at) VALUES (?, ?, ?, ?, ?)",
        [String(a._id), a.name || "", a.logoUrl || "", a.order ?? 0, a.createdAt ? new Date(a.createdAt) : new Date()],
      );
    }
    console.log(`Synced affiliates (${affList.length})`);
  }

  // Blog posts
  const blogList = await docs("blogposts");
  if (blogList.length > 0) {
    await pool.query("DELETE FROM blog_posts");
    for (const b of blogList) {
      await pool.query(
        "INSERT INTO blog_posts (id, title, slug, category, excerpt, content, cover_image, published, author, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          String(b._id),
          b.title || "",
          b.slug || "",
          b.category || "Technology",
          b.excerpt || "",
          b.content || "{}",
          b.coverImage || "",
          b.published ? 1 : 0,
          b.author || "Skytech Team",
          JSON.stringify(b.tags || []),
          b.createdAt ? new Date(b.createdAt) : new Date(),
          b.updatedAt ? new Date(b.updatedAt) : new Date(),
        ],
      );
    }
    console.log(`Synced blog posts (${blogList.length})`);
  }

  // Internship submissions (free-form data)
  const internList = await docs("internshipsubmissions");
  if (internList.length > 0) {
    await pool.query("DELETE FROM internship_submissions");
    for (const s of internList) {
      const { _id, __v, submittedAt, ...rest } = s;
      await pool.query(
        "INSERT INTO internship_submissions (id, data, enrolled, submitted_at) VALUES (?, ?, ?, ?)",
        [String(_id), JSON.stringify(rest), s.enrolled ? 1 : 0, s.submittedAt ? new Date(s.submittedAt) : new Date()],
      );
    }
    console.log(`Synced internship submissions (${internList.length})`);
  }

  console.log("Data migration complete.");
}

const run = process.argv.includes("--sync");

(async () => {
  try {
    await createSchema();
    if (run) await sync();
    await pool.end();
    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
