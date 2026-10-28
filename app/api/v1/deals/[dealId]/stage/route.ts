import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatDeal } from "@/lib/crm/formatters";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId } = await params;
    const body = await request.json();
    const stage = body.stage;
    if (!stage) return apiError("Stage is required", 400);

    await initCrmSchema();
    await crmExecute("UPDATE deals SET stage = ?, updated_at = NOW() WHERE id = ?", [stage, dealId]);

    const updated = await crmQuery<MysqlRow>("SELECT * FROM deals WHERE id = ?", [dealId]);
    if (!updated.length) return apiError("Deal not found", 404);

    return apiSuccess(formatDeal(updated[0]), "Stage updated");
  } catch (error: any) {
    return apiError(error.message || "Failed to update stage", 500);
  }
}
