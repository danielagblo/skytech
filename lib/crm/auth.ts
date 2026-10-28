import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { crmQuery, initCrmSchema, MysqlRow } from "./db";
import { User } from "@/types/user.types";

const JWT_SECRET = process.env.CRM_JWT_SECRET || process.env.JWT_SECRET || "skytech-crm-default-jwt-secret-key-replace-in-env";
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function generateTokens(user: { id: string; email: string; role: string; companyId?: string }) {
  const payload = {
    sub: user.id,
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId || "",
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign({ sub: user.id, id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function formatUser(row: MysqlRow): User {
  return {
    id: String(row.id),
    companyId: row.company_id ? String(row.company_id) : "",
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    email: row.email || "",
    phone: row.phone || null,
    username: row.username || null,
    role: row.role || "AGENT",
    planTier: row.plan_tier || "FREE",
    profilePhotoUrl: row.profile_photo_url || null,
    active: Boolean(row.is_active),
    lastLogin: row.last_login ? new Date(row.last_login).toISOString() : null,
    lastSeenAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    presenceStatus: "ONLINE",
    clientRatingAverage: null,
    clientRatingCount: 0,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function getAuthUser(request: NextRequest): Promise<User | null> {
  await initCrmSchema();
  let token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    token = request.cookies.get("skytech_access")?.value;
  }
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.sub) return null;

  const users = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ? AND is_active = 1 AND deleted_at IS NULL LIMIT 1", [decoded.sub]);
  if (!users.length) return null;

  return formatUser(users[0]);
}

export function apiSuccess<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiError(message: string, status = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
