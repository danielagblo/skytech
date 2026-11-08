import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatEvent } from "@/lib/crm/formatters";
import type { CalendarEvent } from "@/types/calendar.types";

function asIso(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function followUpLabel(logType: string) {
  if (logType === "PAYMENT") return "Payment follow-up";
  if (logType === "SETTLEMENT") return "Settlement follow-up";
  if (logType === "CLIENT_RETENTION") return "Retention follow-up";
  return "Negotiation follow-up";
}

async function datedTargets(): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];
  const followUps = await crmQuery<MysqlRow>(
    `SELECT dl.id, dl.deal_id, dl.log_type, dl.follow_up_at, dl.created_at, d.title, d.assigned_to
     FROM deal_logs dl
     JOIN deals d ON d.id = dl.deal_id AND d.deleted_at IS NULL
     WHERE dl.follow_up_at IS NOT NULL`,
  );
  for (const row of followUps) {
    const start = asIso(row.follow_up_at);
    if (!start) continue;
    events.push({
      id: `follow-${row.id}`,
      title: `${followUpLabel(String(row.log_type || ""))} · ${row.title || "Deal"}`,
      description: null,
      ownerId: row.assigned_to ? String(row.assigned_to) : "",
      linkedLeadId: null,
      linkedDealId: String(row.deal_id),
      startTime: start,
      endTime: start,
      eventType: "CALL_LOG_FOLLOWUP",
      assignees: row.assigned_to ? [String(row.assigned_to)] : [],
      createdAt: asIso(row.created_at) || start,
    });
  }

  const settlementFollowUps = await crmQuery<MysqlRow>(
    `SELECT dl.id, dl.deal_id, dl.settlement_follow_up, dl.created_at, d.title, d.assigned_to
     FROM deal_logs dl
     JOIN deals d ON d.id = dl.deal_id AND d.deleted_at IS NULL
     WHERE dl.settlement_follow_up IS NOT NULL`,
  );
  for (const row of settlementFollowUps) {
    const start = asIso(row.settlement_follow_up);
    if (!start) continue;
    events.push({
      id: `settlement-follow-${row.id}`,
      title: `Settlement follow-up · ${row.title || "Deal"}`,
      description: null,
      ownerId: row.assigned_to ? String(row.assigned_to) : "",
      linkedLeadId: null,
      linkedDealId: String(row.deal_id),
      startTime: start,
      endTime: start,
      eventType: "CALL_LOG_FOLLOWUP",
      assignees: row.assigned_to ? [String(row.assigned_to)] : [],
      createdAt: asIso(row.created_at) || start,
    });
  }

  const deals = await crmQuery<MysqlRow>(
    `SELECT id, title, assigned_to, created_at, domain_expiry, hosting_expiry, maintenance_expiry
     FROM deals
     WHERE deleted_at IS NULL
       AND (domain_expiry IS NOT NULL OR hosting_expiry IS NOT NULL OR maintenance_expiry IS NOT NULL)`,
  );
  const renewals = [
    ["domain_expiry", "Domain renewal"],
    ["hosting_expiry", "Hosting renewal"],
    ["maintenance_expiry", "Maintenance renewal"],
  ] as const;
  for (const deal of deals) {
    for (const [column, label] of renewals) {
      const start = asIso(deal[column]);
      if (!start) continue;
      events.push({
        id: `${column}-${deal.id}`,
        title: `${label} · ${deal.title || "Deal"}`,
        description: null,
        ownerId: deal.assigned_to ? String(deal.assigned_to) : "",
        linkedLeadId: null,
        linkedDealId: String(deal.id),
        startTime: start,
        endTime: start,
        eventType: "REMINDER",
        assignees: deal.assigned_to ? [String(deal.assigned_to)] : [],
        createdAt: asIso(deal.created_at) || start,
      });
    }
  }

  const invoices = await crmQuery<MysqlRow>(
    `SELECT id, deal_id, invoice_number, recipient_name, due_date, created_at, created_by
     FROM invoices
     WHERE due_date IS NOT NULL AND voided_at IS NULL AND status <> 'VOID'`,
  );
  for (const invoice of invoices) {
    const start = asIso(invoice.due_date);
    if (!start) continue;
    const who = invoice.recipient_name ? ` · ${invoice.recipient_name}` : "";
    events.push({
      id: `invoice-due-${invoice.id}`,
      title: `Invoice ${invoice.invoice_number || ""} due${who}`.trim(),
      description: null,
      ownerId: invoice.created_by ? String(invoice.created_by) : "",
      linkedLeadId: null,
      linkedDealId: invoice.deal_id ? String(invoice.deal_id) : null,
      startTime: start,
      endTime: start,
      eventType: "PAYMENT_DUE",
      assignees: [],
      createdAt: asIso(invoice.created_at) || start,
    });
  }

  return events;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM calendar_events ORDER BY start_time ASC"
    );

    const content = [...rows.map(formatEvent), ...(await datedTargets())];
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
