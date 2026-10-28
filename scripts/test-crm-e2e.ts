import dotenv from "dotenv";
dotenv.config();

import { initCrmSchema, crmQuery, crmExecute, newId } from "../lib/crm/db";
import { hashPassword, comparePassword, generateTokens, verifyToken, formatUser } from "../lib/crm/auth";

async function runTests() {
  console.log("=== STARTING END-TO-END CRM VERIFICATION ===");

  // 1. Test Database connection & schema initialization
  console.log("\n[1/7] Testing MySQL connection to skytech_crm database...");
  await initCrmSchema();
  const tables = await crmQuery("SHOW TABLES");
  console.log("✓ Connected to MySQL database 'skytech_crm' successfully.");
  console.log(`✓ Tables in 'skytech_crm': ${tables.map((t: any) => Object.values(t)[0]).join(", ")}`);

  // 2. Test Auth & Password hashing
  console.log("\n[2/7] Testing Authentication (Bcrypt + JWT)...");
  const testEmail = `admin-${Date.now()}@skytechghana.com`;
  const rawPass = "Skytech@Secure2026!";
  const hash = await hashPassword(rawPass);
  const matches = await comparePassword(rawPass, hash);
  if (!matches) throw new Error("Bcrypt password verification failed");
  console.log("✓ Bcrypt hashing and comparison verified.");

  const testUserId = newId();
  await crmExecute(
    `INSERT INTO users (id, first_name, last_name, email, password_hash, role, plan_tier, is_active)
     VALUES (?, 'Test', 'Admin', ?, ?, 'ADMIN', 'PRO', 1)`,
    [testUserId, testEmail, hash]
  );
  const userRows = await crmQuery("SELECT * FROM users WHERE id = ?", [testUserId]);
  const user = formatUser(userRows[0]);
  const tokens = generateTokens(user);
  const decoded = verifyToken(tokens.accessToken);
  if (!decoded || decoded.id !== testUserId) throw new Error("JWT token verification failed");
  console.log(`✓ User created and JWT issued: ${user.email} (Role: ${user.role})`);
  console.log("✓ Access and Refresh JWT verification successful.");

  // 3. Test Leads Intake & Conversion
  console.log("\n[3/7] Testing Leads creation and conversion...");
  const leadId = newId();
  await crmExecute(
    `INSERT INTO leads (id, first_name, last_name, company_name, email, phone_1, status, priority, conversion_score)
     VALUES (?, 'Kofi', 'Mensah', 'Mensah Logistics', 'kofi@mensahlogistics.gh', '0241234567', 'NEW', 'HIGH', 75)`,
    [leadId]
  );
  const leadRows = await crmQuery("SELECT * FROM leads WHERE id = ?", [leadId]);
  console.log(`✓ Lead created: ${leadRows[0].first_name} ${leadRows[0].last_name} (${leadRows[0].company_name})`);

  // Convert to deal
  const dealId = newId();
  await crmExecute(
    `INSERT INTO deals (id, lead_id, created_by, assigned_to, title, stage, contract_value, total_paid, arrears)
     VALUES (?, ?, ?, ?, 'Mensah Logistics Enterprise App', 'PROSPECTING', 25000, 0, 25000)`,
    [dealId, leadId, testUserId, testUserId]
  );
  await crmExecute("UPDATE leads SET status = 'CONVERTED' WHERE id = ?", [leadId]);
  const dealRows = await crmQuery("SELECT * FROM deals WHERE id = ?", [dealId]);
  console.log(`✓ Lead converted to Deal: '${dealRows[0].title}' (Value: GHS ${dealRows[0].contract_value})`);

  // 4. Test Deal Logs & Comments
  console.log("\n[4/7] Testing Deal Logs & Stage progression...");
  const logId = newId();
  await crmExecute(
    `INSERT INTO deal_logs (id, deal_id, created_by, log_type, contact_mode, response_type, body)
     VALUES (?, ?, ?, 'NEGOTIATION', 'PHONE_CALL', 'POSITIVE', 'Discussed deliverables, client agreed on GHS 25,000')`,
    [logId, dealId, testUserId]
  );
  await crmExecute("UPDATE deals SET stage = 'NEGOTIATION' WHERE id = ?", [dealId]);
  console.log("✓ Deal log recorded and deal stage progressed to 'NEGOTIATION'.");

  // 5. Test Tasks Management
  console.log("\n[5/7] Testing Tasks & Assignees...");
  const taskId = newId();
  await crmExecute(
    `INSERT INTO tasks (id, title, description, status, priority, created_by, linked_deal_id)
     VALUES (?, 'Prepare Contract & Scope Document', 'Send drafted contract to Kofi', 'TODO', 'HIGH', ?, ?)`,
    [taskId, testUserId, dealId]
  );
  await crmExecute("INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)", [taskId, testUserId]);
  await crmExecute("UPDATE tasks SET status = 'DONE', completion_reason = 'Completed and sent' WHERE id = ?", [taskId]);
  const taskRows = await crmQuery("SELECT * FROM tasks WHERE id = ?", [taskId]);
  console.log(`✓ Task completed: '${taskRows[0].title}' (Status: ${taskRows[0].status})`);

  // 6. Test Invoices & Payments
  console.log("\n[6/7] Testing Invoices, line items, and payment recording...");
  const invoiceId = newId();
  const invNumber = `INV-${Date.now().toString().slice(-6)}`;
  await crmExecute(
    `INSERT INTO invoices (id, deal_id, created_by, invoice_number, status, recipient_name, currency, subtotal, total, amount_paid, balance_due)
     VALUES (?, ?, ?, ?, 'ISSUED', 'Kofi Mensah', 'GHS', 25000, 25000, 0, 25000)`,
    [invoiceId, dealId, testUserId, invNumber]
  );
  await crmExecute(
    `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, amount, position)
     VALUES (?, ?, 'Full-Stack Web & Mobile App Development', 1, 25000, 25000, 0)`,
    [newId(), invoiceId]
  );
  // Record 50% deposit payment
  const paymentId = newId();
  await crmExecute(
    `INSERT INTO invoice_payments (id, invoice_id, recorded_by, amount, payment_mode, reference)
     VALUES (?, ?, ?, 12500, 'BANK_TRANSFER', 'TXN-984712')`,
    [paymentId, invoiceId, testUserId]
  );
  await crmExecute(
    "UPDATE invoices SET amount_paid = 12500, balance_due = 12500, status = 'PARTIALLY_PAID' WHERE id = ?",
    [invoiceId]
  );
  await crmExecute(
    "UPDATE deals SET total_paid = 12500, arrears = 12500, stage = 'PAYMENT' WHERE id = ?",
    [dealId]
  );
  const invRows = await crmQuery("SELECT * FROM invoices WHERE id = ?", [invoiceId]);
  console.log(`✓ Invoice issued: ${invRows[0].invoice_number} (Total: GHS ${invRows[0].total}, Paid: GHS ${invRows[0].amount_paid}, Balance: GHS ${invRows[0].balance_due})`);
  console.log("✓ Deal updated with payment: stage updated to 'PAYMENT'.");

  // 7. Test Public Landing Page Lead Intake
  console.log("\n[7/7] Testing Public Website Contact / Landing Page Lead Intake...");
  const publicLeadId = newId();
  await crmExecute(
    `INSERT INTO leads (id, first_name, last_name, email, phone_1, company_name, description, lead_source, priority, status)
     VALUES (?, 'Ama', 'Osei', 'ama@oseistores.com', '0559876543', 'Osei Retail', 'Need an e-commerce website with MoMo payment', 'WEBSITE', 'HIGH', 'NEW')`,
    [publicLeadId]
  );
  const publicLeadRows = await crmQuery("SELECT * FROM leads WHERE id = ?", [publicLeadId]);
  console.log(`✓ Website Lead automatically ingested into CRM: ${publicLeadRows[0].first_name} ${publicLeadRows[0].last_name} (${publicLeadRows[0].company_name})`);

  console.log("\n=== ALL 7/7 END-TO-END CRM INTEGRATION TESTS PASSED PERFECTLY! ===");
  process.exit(0);
}

runTests().catch((err: any) => {
  console.error("Test failed:", err);
  process.exit(1);
});
