import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

export type MysqlRow = Record<string, any>;

let cached: {
  promise: Promise<mysql.Pool> | null;
  pool: mysql.Pool | null;
} = (global as any).__skytech_crm_mysql || { promise: null, pool: null };
(global as any).__skytech_crm_mysql = cached;

function resolveHost(host: string | undefined): string {
  if (!host || host === "localhost") return "127.0.0.1";
  return host;
}

export function newId(): string {
  return randomUUID();
}

export function getCrmPool(): Promise<mysql.Pool> {
  if (cached.pool) return Promise.resolve(cached.pool);
  if (!cached.promise) {
    cached.promise = (async () => {
      // Support dedicated CRM database credentials, falling back to main MySQL credentials with crm database
      const host = resolveHost(process.env.CRM_MYSQL_HOST || process.env.MYSQL_HOST);
      const port = parseInt(process.env.CRM_MYSQL_PORT || process.env.MYSQL_PORT || "3306", 10);
      const user = process.env.CRM_MYSQL_USER || process.env.MYSQL_USER || "root";
      const password = process.env.CRM_MYSQL_PASSWORD !== undefined
        ? process.env.CRM_MYSQL_PASSWORD
        : (process.env.MYSQL_PASSWORD || "");
      const database = process.env.CRM_MYSQL_DATABASE || "skytech_crm";
      const ssl = (process.env.CRM_MYSQL_SSL || process.env.MYSQL_SSL) === "1";

      console.info(`[crm-mysql] connecting to ${host}:${port}/${database} (ssl=${ssl ? "on" : "off"})`);

      const pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        dateStrings: false,
        supportBigNumbers: true,
        connectTimeout: 15000,
        ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
      });

      cached.pool = pool;
      return pool;
    })();
  }
  return cached.promise;
}

export async function crmQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const pool = await getCrmPool();
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function crmExecute(sql: string, params: any[] = []): Promise<any> {
  const pool = await getCrmPool();
  const [result] = await pool.execute(sql, params);
  return result;
}

let schemaInitialized = false;

export async function initCrmSchema() {
  if (schemaInitialized) return;
  const pool = await getCrmPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      username VARCHAR(100) UNIQUE,
      role VARCHAR(50) NOT NULL DEFAULT 'AGENT',
      plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE',
      profile_photo_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      last_login DATETIME,
      otp_code VARCHAR(10),
      otp_expires_at DATETIME,
      refresh_token_hash VARCHAR(255),
      deleted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      assigned_to JSON,
      created_by VARCHAR(36),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255),
      phone_1 VARCHAR(30),
      phone_2 VARCHAR(30),
      whatsapp VARCHAR(30),
      company_name VARCHAR(255),
      role VARCHAR(100),
      address TEXT,
      industry VARCHAR(100),
      category VARCHAR(100),
      lead_source VARCHAR(100),
      priority VARCHAR(20) DEFAULT 'MEDIUM',
      status VARCHAR(50) DEFAULT 'NEW',
      launch_timeline VARCHAR(50),
      has_public_office BOOLEAN DEFAULT FALSE,
      meeting_arranged BOOLEAN DEFAULT FALSE,
      birthday DATE,
      sms_opt_in BOOLEAN DEFAULT FALSE,
      email_opt_in BOOLEAN DEFAULT FALSE,
      newsletter_opt_in BOOLEAN DEFAULT FALSE,
      description TEXT,
      conversion_score INT DEFAULT 0,
      deleted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      lead_id VARCHAR(36),
      created_by VARCHAR(36),
      assigned_to VARCHAR(36),
      title VARCHAR(255) NOT NULL,
      stage VARCHAR(50) NOT NULL DEFAULT 'PROSPECTING',
      priority VARCHAR(20) DEFAULT 'MEDIUM',
      contract_value DECIMAL(15,2) DEFAULT 0,
      total_paid DECIMAL(15,2) DEFAULT 0,
      arrears DECIMAL(15,2) DEFAULT 0,
      is_paid_in_full BOOLEAN DEFAULT FALSE,
      hosting_expiry DATE,
      domain_expiry DATE,
      maintenance_expiry DATE,
      hosting_cost DECIMAL(15,2) DEFAULT 0,
      domain_cost DECIMAL(15,2) DEFAULT 0,
      maintenance_cost DECIMAL(15,2) DEFAULT 0,
      notes TEXT,
      version BIGINT NOT NULL DEFAULT 0,
      deleted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deal_logs (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      deal_id VARCHAR(36) NOT NULL,
      created_by VARCHAR(36),
      log_type VARCHAR(50),
      contact_mode VARCHAR(50),
      response_type VARCHAR(50),
      follow_up_at DATETIME,
      settlement_value DECIMAL(15,2),
      settlement_follow_up DATETIME,
      special_conditions TEXT,
      amount_paid DECIMAL(15,2),
      payment_mode VARCHAR(50),
      invoice_number VARCHAR(100),
      receipt_number VARCHAR(100),
      invoice_issued BOOLEAN DEFAULT FALSE,
      service_type VARCHAR(50),
      expiry_date DATE,
      retention_amount DECIMAL(15,2),
      retention_invoice VARCHAR(100),
      retention_receipt VARCHAR(100),
      auto_review_score INT,
      body TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deal_log_comments (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      deal_log_id VARCHAR(36) NOT NULL,
      parent_comment_id VARCHAR(36),
      author_id VARCHAR(36),
      body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'TODO',
      priority VARCHAR(20) DEFAULT 'MEDIUM',
      created_by VARCHAR(36),
      allow_reminder BOOLEAN DEFAULT TRUE,
      linked_lead_id VARCHAR(36),
      linked_deal_id VARCHAR(36),
      due_date DATETIME,
      completion_reason TEXT,
      version BIGINT NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS task_assignees (
      task_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      PRIMARY KEY (task_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_type VARCHAR(50) DEFAULT 'MEETING',
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      created_by VARCHAR(36),
      assigned_to VARCHAR(36),
      lead_id VARCHAR(36),
      deal_id VARCHAR(36),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      deal_id VARCHAR(36) NOT NULL,
      created_by VARCHAR(36),
      invoice_number VARCHAR(50) UNIQUE,
      status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
      issue_date DATE,
      due_date DATE,
      currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
      recipient_name VARCHAR(255) NOT NULL,
      recipient_company VARCHAR(255),
      recipient_email VARCHAR(255),
      recipient_address TEXT,
      issuer_name VARCHAR(255) NOT NULL DEFAULT 'Skytech',
      issuer_email VARCHAR(255),
      issuer_phone VARCHAR(30),
      issuer_address TEXT,
      issuer_tax_id VARCHAR(100),
      payment_instructions TEXT,
      subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
      tax_rate DECIMAL(7,4) NOT NULL DEFAULT 0,
      tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      total DECIMAL(15,2) NOT NULL DEFAULT 0,
      amount_paid DECIMAL(15,2) NOT NULL DEFAULT 0,
      balance_due DECIMAL(15,2) NOT NULL DEFAULT 0,
      notes TEXT,
      terms TEXT,
      last_send_error TEXT,
      issued_at DATETIME,
      send_requested_at DATETIME,
      sent_at DATETIME,
      paid_at DATETIME,
      voided_at DATETIME,
      version BIGINT NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      invoice_id VARCHAR(36) NOT NULL,
      description VARCHAR(500) NOT NULL,
      quantity DECIMAL(15,4) NOT NULL,
      unit_price DECIMAL(15,2) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      position INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_payments (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      invoice_id VARCHAR(36) NOT NULL,
      deal_log_id VARCHAR(36),
      recorded_by VARCHAR(36),
      amount DECIMAL(15,2) NOT NULL,
      payment_mode VARCHAR(50) NOT NULL,
      reference VARCHAR(100),
      paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      deal_id VARCHAR(36),
      lead_id VARCHAR(36),
      token VARCHAR(100) UNIQUE NOT NULL,
      score INT,
      feedback TEXT,
      client_name VARCHAR(255),
      client_email VARCHAR(255),
      expires_at DATETIME,
      submitted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS department_targets (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      department VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      month INT,
      target_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      target_leads INT NOT NULL DEFAULT 0,
      target_deals INT NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS in_app_notifications (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT,
      link VARCHAR(255),
      is_read BOOLEAN DEFAULT FALSE,
      read_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      company_name VARCHAR(255) DEFAULT 'Skytech',
      currency VARCHAR(10) DEFAULT 'GHS',
      time_zone VARCHAR(50) DEFAULT 'Africa/Accra',
      issuer_name VARCHAR(255) DEFAULT 'Skytech',
      issuer_email VARCHAR(255) DEFAULT 'info@skytechghana.com',
      issuer_phone VARCHAR(30),
      issuer_address TEXT,
      issuer_tax_id VARCHAR(100),
      payment_instructions TEXT,
      sms_sender_id VARCHAR(50) DEFAULT 'Skytech',
      lead_assignment JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  try {
    await pool.query("ALTER TABLE settings ADD COLUMN lead_assignment JSON");
  } catch {}

  await pool.query(`
    CREATE TABLE IF NOT EXISTS automations (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      name VARCHAR(255) NOT NULL,
      trigger_type VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      config JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS broadcasts (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36),
      title VARCHAR(255) NOT NULL,
      channel VARCHAR(20) NOT NULL,
      recipient_type VARCHAR(50) NOT NULL,
      recipient_count INT DEFAULT 0,
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'DRAFT',
      scheduled_for DATETIME,
      sent_at DATETIME,
      created_by VARCHAR(36),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  schemaInitialized = true;
}
