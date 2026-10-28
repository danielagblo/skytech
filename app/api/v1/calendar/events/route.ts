import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatEvent } from "@/lib/crm/formatters";

export { formatEvent };

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM calendar_events ORDER BY start_time ASC"
    );

    const content = rows.map(formatEvent);
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
    const eventId = newId();

    await crmExecute(
      `INSERT INTO calendar_events (
        id, company_id, title, description, event_type,
        start_time, end_time, created_by, assigned_to, lead_id, deal_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        user.companyId || null,
        body.title || "Untitled Event",
        body.description || null,
        body.eventType || "MEETING",
        body.startTime ? new Date(body.startTime) : new Date(),
        body.endTime ? new Date(body.endTime) : new Date(),
        user.id,
        body.assignees?.[0] || user.id,
        body.linkedLeadId || null,
        body.linkedDealId || null,
      ]
    );

    const created = await crmQuery<MysqlRow>("SELECT * FROM calendar_events WHERE id = ?", [eventId]);
    return apiSuccess(formatEvent(created[0]), "Event created", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
