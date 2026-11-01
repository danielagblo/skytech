import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatLead } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [leadId]
    );

    if (!rows.length) return apiError("Lead not found", 404);
    return apiSuccess(formatLead(rows[0]));
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch lead", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    const body = await request.json();
    await initCrmSchema();

    const existing = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [leadId]
    );
    if (!existing.length) return apiError("Lead not found", 404);

    let firstName = body.firstName !== undefined ? body.firstName : (body.first_name !== undefined ? body.first_name : undefined);
    let lastName = body.lastName !== undefined ? body.lastName : (body.last_name !== undefined ? body.last_name : undefined);

    if (firstName === undefined && lastName === undefined && (body.name || body.fullName)) {
      const parts = String(body.name || body.fullName).trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
    if (typeof firstName === "string" && !lastName && firstName.includes(" ")) {
      const parts = firstName.trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }

    let birthdayValue: string | null | undefined = undefined;
    if (body.birthday !== undefined) {
      if (!body.birthday) {
        birthdayValue = null;
      } else {
        const bStr = String(body.birthday).trim();
        if (/^\d{2}-\d{2}$/.test(bStr)) {
          birthdayValue = `2000-${bStr}`;
        } else if (/^\d{4}-\d{2}-\d{2}/.test(bStr)) {
          birthdayValue = bStr.slice(0, 10);
        } else {
          birthdayValue = null;
        }
      }
    }

    const assignedTo = body.assignedTo !== undefined
      ? JSON.stringify(body.assignedTo)
      : (typeof existing[0].assigned_to === "string" ? existing[0].assigned_to : JSON.stringify(existing[0].assigned_to || []));

    await crmExecute(
      `UPDATE leads SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone_1 = COALESCE(?, phone_1),
        phone_2 = COALESCE(?, phone_2),
        whatsapp = COALESCE(?, whatsapp),
        company_name = COALESCE(?, company_name),
        role = COALESCE(?, role),
        address = COALESCE(?, address),
        industry = COALESCE(?, industry),
        category = COALESCE(?, category),
        lead_source = COALESCE(?, lead_source),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        launch_timeline = COALESCE(?, launch_timeline),
        birthday = ${birthdayValue !== undefined ? "?" : "birthday"},
        description = COALESCE(?, description),
        assigned_to = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        firstName ?? null,
        lastName ?? null,
        body.email ?? body.emailAddress ?? null,
        body.phone1 ?? body.phone ?? null,
        body.phone2 ?? null,
        body.whatsapp ?? null,
        body.companyName ?? body.company ?? null,
        body.role ?? null,
        body.address ?? null,
        body.industry ?? null,
        body.category ?? body.industry ?? null,
        body.leadSource ?? body.source ?? null,
        body.priority ?? null,
        body.status ?? null,
        body.launchTimeline ?? null,
        ...(birthdayValue !== undefined ? [birthdayValue] : []),
        body.description ?? null,
        assignedTo,
        leadId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [leadId]);
    return apiSuccess(formatLead(updated[0]), "Lead updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update lead", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    await initCrmSchema();
    await crmExecute("UPDATE leads SET deleted_at = NOW() WHERE id = ?", [leadId]);
    return apiSuccess(null, "Lead deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete lead", 500);
  }
}
