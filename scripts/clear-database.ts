import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { getCrmPool, initCrmSchema, crmExecute, crmQuery, newId } from "../lib/crm/db";
import { hashPassword } from "../lib/crm/auth";

const CRM_TABLES = [
  "deal_log_comments",
  "deal_logs",
  "deals",
  "leads",
  "task_comments",
  "task_subtasks",
  "task_assignees",
  "tasks",
  "calendar_events",
  "invoice_payments",
  "invoice_items",
  "invoices",
  "ratings",
  "department_targets",
  "in_app_notifications",
  "broadcasts",
  "automations",
  "settings",
  "users",
];

const WEBSITE_TABLES = [
  "blog_posts",
  "internship_submissions",
  "contact_submissions",
  "booklet_downloads",
  "affiliates",
  "faqs",
  "team_members",
  "testimonials",
  "projects",
  "pricing",
  "hero",
  "images",
];

async function clearDatabase() {
  if (process.env.SKIP_DB_CLEAR === "true" || process.env.SKIP_DB_CLEAR === "1") {
    console.log("\n⏭️ SKIP_DB_CLEAR is set to true. Skipping database reset.\n");
    process.exit(0);
  }

  console.log("\n=======================================================");
  console.log("       SKYTECH DATABASE CLEAR & SUPERADMIN SEED        ");
  console.log("=======================================================\n");

  const clearWebsite = process.argv.includes("--all") || process.argv.includes("--with-website");
  const adminEmail = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "agblo27@gmail.com").trim().toLowerCase();
  const adminPassword = (process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "Skytech@2026!");

  await initCrmSchema();
  const pool = await getCrmPool();

  console.log("1. Temporarily disabling foreign key constraints...");
  await pool.query("SET FOREIGN_KEY_CHECKS = 0;");

  console.log("\n2. Clearing CRM tables...");
  for (const table of CRM_TABLES) {
    try {
      await pool.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`   ✓ Truncated: ${table}`);
    } catch {
      try {
        await pool.query(`DELETE FROM \`${table}\``);
        console.log(`   ✓ Emptied (DELETE): ${table}`);
      } catch (err: any) {
        console.warn(`   ! Skipped ${table}: ${err.message}`);
      }
    }
  }

  if (clearWebsite) {
    console.log("\n3. Clearing Website CMS tables (--all specified)...");
    for (const table of WEBSITE_TABLES) {
      try {
        await pool.query(`TRUNCATE TABLE \`${table}\``);
        console.log(`   ✓ Truncated: ${table}`);
      } catch {
        try {
          await pool.query(`DELETE FROM \`${table}\``);
          console.log(`   ✓ Emptied (DELETE): ${table}`);
        } catch (err: any) {
          console.warn(`   ! Skipped ${table}: ${err.message}`);
        }
      }
    }
  }

  console.log("\n4. Re-enabling foreign key constraints...");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1;");

  console.log("\n5. Seeding default Superadmin user(s)...");
  const hashedPassword = await hashPassword(adminPassword);

  const superadmins = [
    {
      id: newId(),
      firstName: "Daniel",
      lastName: "Agblo",
      email: adminEmail,
      username: "admin",
      role: "ADMIN",
      planTier: "PRO",
    },
  ];

  // If primary email is not agblod27@gmail.com, also add it as an admin backup so neither variant is locked out
  if (adminEmail !== "agblod27@gmail.com") {
    superadmins.push({
      id: newId(),
      firstName: "Daniel",
      lastName: "Agblo",
      email: "agblod27@gmail.com",
      username: "agblod27",
      role: "ADMIN",
      planTier: "PRO",
    });
  }

  for (const admin of superadmins) {
    await crmExecute(
      `INSERT INTO users (
        id, first_name, last_name, email, password_hash,
        username, role, plan_tier, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        admin.id,
        admin.firstName,
        admin.lastName,
        admin.email,
        hashedPassword,
        admin.username,
        admin.role,
        admin.planTier,
      ]
    );
    console.log(`   ✓ Created Superadmin: ${admin.email} (Username: ${admin.username})`);
  }

  console.log("\n6. Seeding default company settings...");
  await crmExecute(
    `INSERT INTO settings (
      id, company_name, currency, time_zone, issuer_name, issuer_email, sms_sender_id, created_at, updated_at
    ) VALUES (?, 'Skytech Ghana', 'GHS', 'Africa/Accra', 'Skytech', 'info@skytechghana.com', 'Skytech', NOW(), NOW())`,
    [newId()]
  );
  console.log("   ✓ Default company settings initialized.");

  console.log("\n=======================================================");
  console.log("              DATABASE CLEARED & READY!                ");
  console.log("=======================================================");
  console.log("  Default Superadmin Credentials:");
  console.log(`  - Email:    ${adminEmail}`);
  console.log(`  - Password: ${adminPassword}`);
  console.log(`  - Role:     ADMIN (PRO)`);
  console.log("-------------------------------------------------------");
  console.log("  Login at: https://crm.skytechghana.com/login");
  console.log("=======================================================\n");

  process.exit(0);
}

clearDatabase().catch((err) => {
  console.error("\n❌ Error clearing database:", err);
  process.exit(1);
});
