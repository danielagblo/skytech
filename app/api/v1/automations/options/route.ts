import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    return apiSuccess({
      types: ["BIRTHDAY", "HOLIDAY", "PAYMENT_REMINDER", "LEAD_NURTURE"],
      channels: ["SMS", "EMAIL", "BOTH"],
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
