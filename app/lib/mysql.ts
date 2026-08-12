import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

export type MysqlRow = Record<string, any>;

let cached: {
  promise: Promise<mysql.Pool> | null;
  pool: mysql.Pool | null;
} = (global as any).__skytech_mysql || { promise: null, pool: null };
(global as any).__skytech_mysql = cached;

let schemaInitialized = false;

export function newId(): string {
  return randomUUID();
}

// Force IPv4 loopback for "localhost": on Hostinger-style setups "localhost"
// resolves to ::1 (IPv6), but MySQL account grants only match 127.0.0.1.
function resolveMysqlHost(host: string | undefined): string {
  if (!host || host === "localhost") return "127.0.0.1";
  return host;
}

let debugLogged = false;

export function getPool(): Promise<mysql.Pool> {
  if (cached.pool) return Promise.resolve(cached.pool);
  if (!cached.promise) {
    cached.promise = (async () => {
      const host = resolveMysqlHost(process.env.MYSQL_HOST);
      const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
      if (!debugLogged) {
        console.info(
          `[mysql] connecting to ${host}:${port} (ssl=${process.env.MYSQL_SSL === "1" ? "on" : "off"})`,
        );
        debugLogged = true;
      }
      const pool = mysql.createPool({
        host,
        port,
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "skytech",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        dateStrings: false,
        supportBigNumbers: true,
        connectTimeout: 15000,
        ...(process.env.MYSQL_SSL === "1"
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
      });
      cached.pool = pool;
      return pool;
    })().catch((err) => {
      cached.promise = null;
      throw err;
    });
  }
  return cached.promise;
}

export async function query<T extends MysqlRow = MysqlRow>(
  sql: string,
  params?: any[],
): Promise<T[]> {
  const pool = await getPool();
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function insert(
  table: string,
  data: Record<string, any>,
): Promise<string> {
  const id = data.id || newId();
  const record: Record<string, any> = { ...data, id };
  const keys = Object.keys(record);
  const cols = keys.map((k) => `\`${k}\``).join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  await query(
    `INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`,
    Object.values(record),
  );
  return id;
}

export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
): Promise<void> {
  const { id: _ignored, ...rest } = data;
  const keys = Object.keys(rest);
  if (keys.length === 0) return;
  const sets = keys.map((k) => `\`${k}\` = ?`).join(", ");
  await query(`UPDATE \`${table}\` SET ${sets} WHERE id = ?`, [
    ...Object.values(rest),
    id,
  ]);
}

export async function remove(table: string, id: string): Promise<void> {
  await query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
}

export async function clear(table: string): Promise<void> {
  await query(`DELETE FROM \`${table}\``);
}

let schemaOnce: Promise<void> | null = null;

export async function initSchema(): Promise<void> {
  if (process.env.DB_TYPE !== "mysql") return;
  if (schemaInitialized) return;
  if (!schemaOnce) {
    schemaOnce = (async () => {
      const pool = await getPool();
      const conn = await pool.getConnection();
      try {
        for (const ddl of SCHEMA) {
          await conn.query(ddl);
        }
      } finally {
        conn.release();
      }
      schemaInitialized = true;
    })();
  }
  await schemaOnce;
  await upgradeSchema();
}

// Make sure the images table has the key_path column for hosts that created
// the schema before the column was added. Idempotent (ignores duplicate column errors).
async function upgradeSchema(): Promise<void> {
  const pool = await getPool();
  try {
    await pool.query(
      "ALTER TABLE images ADD COLUMN key_path VARCHAR(255) DEFAULT NULL AFTER mime",
    );
  } catch (error: any) {
    // ER_DUP_FIELDNAME (1060) means it already exists — safe to ignore
    if (!error || error.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }
  try {
    await pool.query(
      "SELECT 1 FROM images WHERE 1 = 0",
    );
  } catch {
    // table doesn't exist yet; initSchema() will create it
  }
}

export const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS hero (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    subtitle VARCHAR(255) DEFAULT '',
    image_url TEXT,
    headline VARCHAR(255) DEFAULT '',
    headline_sub VARCHAR(255) DEFAULT '',
    sub_text TEXT,
    stats JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS pricing (
    id CHAR(36) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    label VARCHAR(100) DEFAULT '',
    packages JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_pricing_category (category)
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image TEXT,
    client VARCHAR(255) DEFAULT 'Global Client',
    impact VARCHAR(255) DEFAULT 'Accelerated Growth',
    metrics JSON,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id CHAR(36) PRIMARY KEY,
    author VARCHAR(255) DEFAULT '',
    company VARCHAR(255) DEFAULT '',
    quote TEXT,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS team_members (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    icon_type VARCHAR(50) DEFAULT 'default',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id CHAR(36) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT,
    category VARCHAR(100) DEFAULT 'General',
    sort_order INT DEFAULT 0,
    published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS affiliates (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Technology',
    excerpt TEXT,
    content LONGTEXT,
    cover_image TEXT,
    published TINYINT(1) DEFAULT 0,
    author VARCHAR(255) DEFAULT 'Skytech Team',
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_blog_slug (slug)
  )`,
  `CREATE TABLE IF NOT EXISTS internship_submissions (
    id CHAR(36) PRIMARY KEY,
    data JSON,
    enrolled TINYINT(1) DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS contact_submissions (
    id CHAR(36) PRIMARY KEY,
    data JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS analytics_events (
    id CHAR(36) PRIMARY KEY,
    type VARCHAR(50) DEFAULT '',
    page VARCHAR(255) DEFAULT '',
    session_id VARCHAR(255) DEFAULT '',
    source VARCHAR(100) DEFAULT '',
    device_type VARCHAR(50) DEFAULT '',
    browser VARCHAR(50) DEFAULT '',
    country VARCHAR(100) DEFAULT '',
    action VARCHAR(255) DEFAULT '',
    data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS images (
    id CHAR(36) PRIMARY KEY,
    folder VARCHAR(100) DEFAULT 'misc',
    mime VARCHAR(50) DEFAULT 'image/webp',
    key_path VARCHAR(255) DEFAULT NULL,
    data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_images_key_path (key_path)
  )`,
];

export const isJsonStr = (v: any): boolean =>
  typeof v === "string" && (v.startsWith("[") || v.startsWith("{"));

export function parseJson<T = any>(v: any): T | undefined {
  if (v == null || v === "") return undefined;
  if (typeof v !== "string") return v as T;
  try {
    return JSON.parse(v) as T;
  } catch {
    return v as T;
  }
}

export function fromBool(v: any): boolean {
  return v === true || v === 1 || v === "1";
}

export function toBool(v: any): 1 | 0 {
  return v ? 1 : 0;
}