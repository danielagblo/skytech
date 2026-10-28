import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { DepartmentAchievementResponse } from "@/types/department-target.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const period = new URL(request.url).searchParams.get("period") || "monthly";

    const res: DepartmentAchievementResponse = {
      period,
      overallPct: 82,
      metrics: [
        { metric: "CALLS", target: 50, actual: 42, achievementPct: 84 },
        { metric: "DEALS_CLOSED", target: 10, actual: 8, achievementPct: 80 },
        { metric: "REVENUE", target: 100000, actual: 82000, achievementPct: 82 },
      ],
      agents: [],
    };

    return apiSuccess(res);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
