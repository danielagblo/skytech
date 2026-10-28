import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM settings LIMIT 1");
    const general = rows.length ? rows[0] : {
      company_name: "Skytech",
      currency: "GHS",
      time_zone: "Africa/Accra",
      issuer_name: "Skytech",
      issuer_email: "info@skytechghana.com",
    };

    return apiSuccess({
      general,
      leadAssignment: {
        mode: "ROUND_ROBIN",
        activeAgentIds: [],
        enabled: true,
      },
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const g = body.general || {};

    const rows = await crmQuery<MysqlRow>("SELECT id FROM settings LIMIT 1");
    if (rows.length) {
      await crmExecute(
        `UPDATE settings SET
          company_name = COALESCE(?, company_name),
          currency = COALESCE(?, currency),
          time_zone = COALESCE(?, time_zone),
          issuer_name = COALESCE(?, issuer_name),
          issuer_email = COALESCE(?, issuer_email),
          issuer_phone = COALESCE(?, issuer_phone),
          issuer_address = COALESCE(?, issuer_address),
          updated_at = NOW()
        WHERE id = ?`,
        [
          g.companyName ?? null,
          g.currency ?? null,
          g.timeZone ?? null,
          g.issuerName ?? null,
          g.issuerEmail ?? null,
          g.issuerPhone ?? null,
          g.issuerAddress ?? null,
          rows[0].id,
        ]
      );
    } else {
      await crmExecute(
        `INSERT INTO settings (id, company_name, currency, time_zone, issuer_name, issuer_email, issuer_phone, issuer_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId(),
          g.companyName || "Skytech",
          g.currency || "GHS",
          g.timeZone || "Africa/Accra",
          g.issuerName || "Skytech",
          g.issuerEmail || "info@skytechghana.com",
          g.issuerPhone || null,
          g.issuerAddress || null,
        ]
      );
    }

    const updated = await crmQuery<MysqlRow>("SELECT * FROM settings LIMIT 1");
    return apiSuccess({
      general: updated[0],
      leadAssignment: {
        mode: "ROUND_ROBIN",
        activeAgentIds: [],
        enabled: true,
      },
    }, "Settings updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
