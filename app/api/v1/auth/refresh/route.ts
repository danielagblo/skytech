import { NextRequest } from "next/server";
import { verifyToken, generateTokens, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, MysqlRow } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken = body.refreshToken || request.cookies.get("skytech_refresh")?.value;

    if (!refreshToken) {
      return apiError("Refresh token is required", 400);
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded || !decoded.sub) {
      return apiError("Invalid refresh token", 401);
    }

    const users = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE id = ? AND is_active = 1 AND deleted_at IS NULL LIMIT 1",
      [decoded.sub]
    );

    if (!users.length) {
      return apiError("User not found or inactive", 401);
    }

    const user = formatUser(users[0]);
    const tokens = generateTokens(user);

    await crmExecute("UPDATE users SET refresh_token_hash = ? WHERE id = ?", [
      tokens.refreshToken,
      user.id,
    ]);

    const response = apiSuccess(
      { accessToken: tokens.accessToken },
      "Token refreshed"
    );

    response.cookies.set("skytech_access", tokens.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error: any) {
    return apiError(error.message || "Failed to refresh token", 500);
  }
}
