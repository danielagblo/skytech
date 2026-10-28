import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    return apiSuccess([], "Seen leads retrieved");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
