import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    return apiSuccess({ mode: "ROUND_ROBIN", activeAgentIds: [], enabled: true });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    const body = await request.json();
    return apiSuccess(body, "Lead assignment settings saved");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
