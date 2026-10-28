import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    await initCrmSchema();

    const dealRows = await crmQuery<MysqlRow>(
      `SELECT COUNT(*) as closedDeals, COALESCE(SUM(total_paid), 0) as revenue
       FROM deals WHERE assigned_to = ? AND stage IN ('SETTLEMENT', 'PAYMENT', 'CLIENT_RETENTION') AND deleted_at IS NULL`,
      [userId]
    );

    return apiSuccess({
      rank: 1,
      closedDeals: Number(dealRows[0]?.closedDeals || 0),
      revenue: Number(dealRows[0]?.revenue || 0),
      loggedCallSeconds: 0,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
