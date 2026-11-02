import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatLead } from "@/lib/crm/formatters";
import { camelize } from "@/lib/case-conversion";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    const cleanLeadId = String(leadId || "").trim();
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? LIMIT 1",
      [cleanLeadId]
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
    const cleanLeadId = String(leadId || "").trim();
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    await initCrmSchema();

    const existing = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? LIMIT 1",
      [cleanLeadId]
    );

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
      : (existing.length && typeof existing[0].assigned_to === "string" ? existing[0].assigned_to : JSON.stringify(existing[0]?.assigned_to || []));

    const hasPublicOffice = body.hasPublicOffice !== undefined
      ? (body.hasPublicOffice ? 1 : 0)
      : (rawBody.has_public_office !== undefined
          ? (rawBody.has_public_office ? 1 : 0)
          : (existing[0]?.has_public_office ? 1 : 0));

    const meetingArranged = body.meetingArranged !== undefined
      ? (body.meetingArranged ? 1 : 0)
      : (rawBody.meeting_arranged !== undefined
          ? (rawBody.meeting_arranged ? 1 : 0)
          : (existing[0]?.meeting_arranged ? 1 : 0));

    const smsOptIn = body.smsOptIn !== undefined
      ? (body.smsOptIn ? 1 : 0)
      : (rawBody.sms_opt_in !== undefined
          ? (rawBody.sms_opt_in ? 1 : 0)
          : (existing[0]?.sms_opt_in ? 1 : 0));

    const emailOptIn = body.emailOptIn !== undefined
      ? (body.emailOptIn ? 1 : 0)
      : (rawBody.email_opt_in !== undefined
          ? (rawBody.email_opt_in ? 1 : 0)
          : (existing[0]?.email_opt_in ? 1 : 0));

    const newsletterOptIn = body.newsletterOptIn !== undefined
      ? (body.newsletterOptIn ? 1 : 0)
      : (rawBody.newsletter_opt_in !== undefined
          ? (rawBody.newsletter_opt_in ? 1 : 0)
          : (existing[0]?.newsletter_opt_in ? 1 : 0));

    const conversionScore = body.conversionScore !== undefined
      ? Number(body.conversionScore) || 0
      : (rawBody.conversion_score !== undefined
          ? Number(rawBody.conversion_score) || 0
          : Number(existing[0]?.conversion_score || 0));

    if (!existing.length) {
      await crmExecute(
        `INSERT INTO leads (
          id, company_id, assigned_to, created_by,
          first_name, last_name, email, phone_1, phone_2, whatsapp,
          company_name, role, address, industry, category, lead_source,
          priority, status, launch_timeline, has_public_office, meeting_arranged,
          birthday, sms_opt_in, email_opt_in, newsletter_opt_in, description, conversion_score,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          cleanLeadId,
          user.companyId || null,
          assignedTo,
          user.id,
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
          body.leadSource ?? body.source ?? "SMS",
          body.priority ?? "MEDIUM",
          body.status ?? "NEW",
          body.launchTimeline ?? null,
          hasPublicOffice,
          meetingArranged,
          birthdayValue ?? null,
          smsOptIn,
          emailOptIn,
          newsletterOptIn,
          body.description ?? null,
          conversionScore,
        ]
      );
      const created = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [cleanLeadId]);
      return apiSuccess(formatLead(created[0]), "Lead saved successfully", 201);
    }

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
        has_public_office = ?,
        meeting_arranged = ?,
        birthday = ${birthdayValue !== undefined ? "?" : "birthday"},
        sms_opt_in = ?,
        email_opt_in = ?,
        newsletter_opt_in = ?,
        description = COALESCE(?, description),
        conversion_score = ?,
        assigned_to = ?,
        deleted_at = NULL,
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
        hasPublicOffice,
        meetingArranged,
        ...(birthdayValue !== undefined ? [birthdayValue] : []),
        smsOptIn,
        emailOptIn,
        newsletterOptIn,
        body.description ?? null,
        conversionScore,
        assignedTo,
        cleanLeadId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [cleanLeadId]);
    return apiSuccess(formatLead(updated[0]), "Lead updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update lead", 500);
  }
}

export const PATCH = PUT;

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
