import dotenv from "dotenv";
dotenv.config();

import { initCrmSchema, crmQuery, crmExecute, newId } from "../lib/crm/db";
import { hashPassword } from "../lib/crm/auth";

async function seedAdmin() {
  console.log("=== SEEDING SKYTECH CRM SUPERADMIN ===");

  await initCrmSchema();

  const email = (process.argv[2] || "agblod27@gmail.com").trim().toLowerCase();
  const password = process.argv[3] || "Skytech@2026!";
  const firstName = process.argv[4] || "Daniel";
  const lastName = process.argv[5] || "Agblo";
  const username = "admin";

  const passwordHash = await hashPassword(password);

  // 1. Check if user already exists
  const existing = await crmQuery<any>(
    "SELECT id, email, role FROM users WHERE LOWER(email) = ? OR username = ?",
    [email, username]
  );

  let userId: string;

  if (existing.length > 0) {
    userId = existing[0].id;
    await crmExecute(
      `UPDATE users SET
        first_name = ?,
        last_name = ?,
        email = ?,
        password_hash = ?,
        role = 'ADMIN',
        plan_tier = 'PRO',
        is_active = 1,
        deleted_at = NULL,
        updated_at = NOW()
      WHERE id = ?`,
      [firstName, lastName, email, passwordHash, userId]
    );
    console.log(`✓ Existing user updated to Superadmin: ${email}`);
  } else {
    userId = newId();
    await crmExecute(
      `INSERT INTO users (
        id, first_name, last_name, email, password_hash,
        username, role, plan_tier, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 'ADMIN', 'PRO', 1)`,
      [userId, firstName, lastName, email, passwordHash, username]
    );
    console.log(`✓ New Superadmin user created: ${email}`);
  }

  // 2. Ensure company settings exist
  const settingsRows = await crmQuery<any>("SELECT id FROM settings LIMIT 1");
  if (settingsRows.length === 0) {
    await crmExecute(
      `INSERT INTO settings (id, company_name, currency, time_zone, issuer_name, issuer_email)
       VALUES (?, 'Skytech Ghana', 'GHS', 'Africa/Accra', 'Skytech', 'info@skytechghana.com')`,
      [newId()]
    );
    console.log("✓ Default company settings seeded.");
  }

  console.log("\n==============================================");
  console.log("  SUPERADMIN CREDENTIALS READY TO LOGIN");
  console.log("==============================================");
  console.log(`  Login URL:  http://crm.localhost:3000/login  (or https://crm.skytechgh.com/login)`);
  console.log(`  Email:      ${email}`);
  console.log(`  Password:   ${password}`);
  console.log(`  Role:       ADMIN (PRO)`);
  console.log("==============================================\n");

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
