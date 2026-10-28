import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { TargetSetting } from "@/types/department-target.types";

const defaultTargets: TargetSetting[] = [
  { metric: "CALLS", target: 50, enabled: true },
  { metric: "DEALS_CLOSED", target: 10, enabled: true },
  { metric: "REVENUE", target: 100000, enabled: true },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const period = new URL(request.url).searchParams.get("period") || "monthly";
    return apiSuccess({ period, targets: defaultTargets });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const period = new URL(request.url).searchParams.get("period") || "monthly";
    const body = await request.json();
    return apiSuccess({ period, targets: body.targets || defaultTargets }, "Targets saved");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
