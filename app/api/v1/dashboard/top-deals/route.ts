import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      `SELECT d.id, d.title, d.contract_value as contractValue, d.stage, d.total_paid as totalPaid
       FROM deals d
       WHERE d.deleted_at IS NULL
       ORDER BY d.contract_value DESC LIMIT 10`
    );

    const content = rows.map((r) => ({
      id: String(r.id),
      title: String(r.title),
      contractValue: Number(r.contractValue || 0),
      stage: String(r.stage || "PROSPECTING"),
      totalPaid: Number(r.totalPaid || 0),
    }));

    return apiSuccess({
      content,
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
      last: true,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
