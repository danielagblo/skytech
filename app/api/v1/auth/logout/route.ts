import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess } from "@/lib/crm/auth";
import { crmExecute } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (user) {
    await crmExecute("UPDATE users SET refresh_token_hash = NULL WHERE id = ?", [user.id]);
  }

  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.delete("skytech_access");
  response.cookies.delete("skytech_refresh");
  return response;
}
