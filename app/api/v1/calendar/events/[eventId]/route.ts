import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatEvent } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { eventId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM calendar_events WHERE id = ? LIMIT 1", [eventId]);
    if (!rows.length) return apiError("Event not found", 404);

    return apiSuccess(formatEvent(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { eventId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE calendar_events SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        event_type = COALESCE(?, event_type),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.title ?? null,
        body.description ?? null,
        body.eventType ?? null,
        body.startTime ? new Date(body.startTime) : null,
        body.endTime ? new Date(body.endTime) : null,
        eventId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM calendar_events WHERE id = ?", [eventId]);
    return apiSuccess(formatEvent(updated[0]), "Event updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { eventId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM calendar_events WHERE id = ?", [eventId]);
    return apiSuccess(null, "Event deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
