import { NextRequest, NextResponse } from "next/server";
import { comparePassword, generateTokens, hashPassword, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  try {
    await initCrmSchema();
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return apiError("Email and password are required", 400);
    }

    let users = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL LIMIT 1",
      [email]
    );

    // Initial seed if table is completely empty
    if (!users.length) {
      const allUsers = await crmQuery<MysqlRow>("SELECT id FROM users LIMIT 1");
      if (allUsers.length === 0) {
        const adminId = newId();
        const hashed = await hashPassword(password);
        await crmExecute(
          `INSERT INTO users (id, first_name, last_name, email, password_hash, role, plan_tier, is_active)
           VALUES (?, ?, ?, ?, ?, 'ADMIN', 'PRO', 1)`,
          [adminId, "Admin", "User", email, hashed]
        );
        users = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ?", [adminId]);
      }
    }

    if (!users.length) {
      return apiError("Invalid credentials", 401);
    }

    const userRow = users[0];
    if (!userRow.is_active) {
      return apiError("Account is inactive", 403);
    }

    const matches = await comparePassword(password, userRow.password_hash);
    if (!matches) {
      return apiError("Invalid credentials", 401);
    }

    const user = formatUser(userRow);
    const tokens = generateTokens(user);

    // Update last_login
    await crmExecute(
      "UPDATE users SET last_login = NOW(), refresh_token_hash = ? WHERE id = ?",
      [tokens.refreshToken, user.id]
    );

    const response = apiSuccess(
      {
        requiresOtp: false,
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
      },
      "Login successful"
    );

    // Set auth cookies for seamless Next.js middleware and SSR
    response.cookies.set("skytech_access", tokens.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 min
    });

    response.cookies.set("skytech_refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("[CRM Login Error]:", error);
    return apiError(error.message || "Failed to log in", 500);
  }
}
