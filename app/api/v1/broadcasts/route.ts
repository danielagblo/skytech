import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatBroadcast } from "@/lib/crm/formatters";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM broadcasts ORDER BY created_at DESC");
    const content = rows.map(formatBroadcast);

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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const id = newId();

    await crmExecute(
      `INSERT INTO broadcasts (
        id, company_id, title, channel, recipient_type,
        recipient_count, message, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?)`,
      [
        id,
        user.companyId || null,
        body.name || body.title || "Untitled Broadcast",
        body.channel || "SMS",
        body.recipientType || "ALL",
        body.recipientCount || 0,
        body.messageContent || body.message || "",
        user.id,
      ]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM broadcasts WHERE id = ?", [id]);
    return apiSuccess(formatBroadcast(rows[0]), "Broadcast created", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
