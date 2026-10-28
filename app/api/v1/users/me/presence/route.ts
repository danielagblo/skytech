import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await crmExecute("UPDATE users SET updated_at = NOW() WHERE id = ?", [user.id]);
    return apiSuccess({ ...user, presenceStatus: "ONLINE" });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
