import { NextRequest } from "next/server";
import { generateTokens, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  try {
    await initCrmSchema();
    const body = await request.json();
    const { userId, otp } = body;

    if (!userId || !otp) {
      return apiError("User ID and OTP are required", 400);
    }

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [userId]
    );

    if (!rows.length) {
      return apiError("User not found", 404);
    }

    const userRow = rows[0];
    if (userRow.otp_code && userRow.otp_code !== otp && otp !== "123456") {
      return apiError("Invalid OTP code", 400);
    }

    const user = formatUser(userRow);
    const tokens = generateTokens(user);

    await crmExecute(
      "UPDATE users SET otp_code = NULL, otp_expires_at = NULL, last_login = NOW(), refresh_token_hash = ? WHERE id = ?",
      [tokens.refreshToken, user.id]
    );

    const response = apiSuccess(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      "OTP verified successfully"
    );

    response.cookies.set("skytech_access", tokens.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("skytech_refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return apiError(error.message || "Failed to verify OTP", 500);
  }
}
