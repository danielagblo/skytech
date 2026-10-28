import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { RatingLinkResponse } from "@/types/rating.types";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const dealId = body.dealId;
    if (!dealId) return apiError("dealId is required", 400);

    const dealRows = await crmQuery<MysqlRow>(
      `SELECT d.*, l.email as client_email, l.first_name, l.last_name
       FROM deals d
       LEFT JOIN leads l ON l.id = d.lead_id
       WHERE d.id = ? LIMIT 1`,
      [dealId]
    );
    if (!dealRows.length) return apiError("Deal not found", 404);

    const deal = dealRows[0];
    const ratingId = newId();
    const token = newId().replace(/-/g, "");

    await crmExecute(
      `INSERT INTO ratings (id, company_id, deal_id, lead_id, token, client_name, client_email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        ratingId,
        user.companyId || null,
        dealId,
        deal.lead_id || null,
        token,
        `${deal.first_name || ""} ${deal.last_name || ""}`.trim() || null,
        deal.client_email || null,
      ]
    );

    const host = request.headers.get("host") || "crm.skytechgh.com";
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const link = `${proto}://${host}/rate-me/${token}`;

    const res: RatingLinkResponse = {
      id: ratingId,
      agentId: user.id,
      dealId,
      clientEmail: deal.client_email || null,
      status: "SENT",
      message: "Rating link created",
      link,
    };

    return apiSuccess(res, "Rating link generated", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
