import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    return apiSuccess({
      segments: [
        { id: "all_leads", name: "All Leads", count: 0 },
        { id: "active_deals", name: "Active Clients", count: 0 },
        { id: "newsletter", name: "Newsletter Subscribers", count: 0 },
      ],
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
