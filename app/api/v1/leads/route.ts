import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatLead } from "@/lib/crm/formatters";
import { camelize } from "@/lib/case-conversion";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const size = Math.max(1, Math.min(100, parseInt(url.searchParams.get("size") || "20", 10)));
    const search = url.searchParams.get("search")?.trim();
    const status = url.searchParams.get("status")?.trim();
    const priority = url.searchParams.get("priority")?.trim();
    const source = url.searchParams.get("source")?.trim();

    let whereSql = "WHERE deleted_at IS NULL";
    const params: any[] = [];

    if (search) {
      whereSql += ` AND (
        first_name LIKE ? OR 
        last_name LIKE ? OR 
        company_name LIKE ? OR 
        email LIKE ? OR 
        phone_1 LIKE ?
      )`;
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern);
    }

    if (status) {
      whereSql += " AND status = ?";
      params.push(status);
    }
    if (priority) {
      whereSql += " AND priority = ?";
      params.push(priority);
    }
    if (source) {
      whereSql += " AND lead_source = ?";
      params.push(source);
    }

    const countRows = await crmQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM leads ${whereSql}`,
      params
    );
    const totalElements = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalElements / size);

    const offset = page * size;
    const rows = await crmQuery<MysqlRow>(
      `SELECT * FROM leads ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    const content = rows.map(formatLead);

    return apiSuccess({
      content,
      page,
      size,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch leads", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    const leadId = newId();

    const assignedToRaw = body.assignedTo ?? rawBody.assigned_to ?? [];
    const assignedTo = Array.isArray(assignedToRaw) ? JSON.stringify(assignedToRaw) : JSON.stringify([]);

    let firstName = (body.firstName || body.first_name || "").trim();
    let lastName = (body.lastName || body.last_name || "").trim();

    // Fallbacks if single name/fullName string was passed
    if (!firstName && !lastName && (body.name || body.fullName)) {
      const parts = String(body.name || body.fullName).trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    // If user typed full name into first name input and left last name blank
    if (firstName && !lastName && firstName.includes(" ")) {
      const parts = firstName.split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }

    // Birthday parsing: supports MM-DD (stored as 2000-MM-DD for MySQL DATE) and YYYY-MM-DD
    let birthday: string | null = null;
    if (body.birthday) {
      const bStr = String(body.birthday).trim();
      if (/^\d{2}-\d{2}$/.test(bStr)) {
        birthday = `2000-${bStr}`;
      } else if (/^\d{4}-\d{2}-\d{2}/.test(bStr)) {
        birthday = bStr.slice(0, 10);
      }
    }

    await crmExecute(
      `INSERT INTO leads (
        id, company_id, assigned_to, created_by,
        first_name, last_name, email, phone_1, phone_2, whatsapp,
        company_name, role, address, industry, category, lead_source,
        priority, status, launch_timeline, has_public_office, meeting_arranged,
        birthday, sms_opt_in, email_opt_in, newsletter_opt_in, description, conversion_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        leadId,
        user.companyId || null,
        assignedTo,
        user.id,
        firstName || null,
        lastName || null,
        body.email || body.emailAddress || null,
        body.phone1 || body.phone || null,
        body.phone2 || null,
        body.whatsapp || null,
        body.companyName || body.company || null,
        body.role || null,
        body.address || null,
        body.industry || null,
        body.category || body.industry || null,
        body.leadSource || body.source || "SMS",
        body.priority || "MEDIUM",
        body.status || "NEW",
        body.launchTimeline || null,
        body.hasPublicOffice ? 1 : 0,
        body.meetingArranged ? 1 : 0,
        birthday,
        body.smsOptIn ? 1 : 0,
        body.emailOptIn ? 1 : 0,
        body.newsletterOptIn ? 1 : 0,
        body.description || null,
        body.conversionScore || 0,
      ]
    );

    const created = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [leadId]);
    return apiSuccess(formatLead(created[0]), "Lead created successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create lead", 500);
  }
}
