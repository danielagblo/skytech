import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { RatingInfoResponse, RatingSubmissionResponse } from "@/types/rating.types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    await initCrmSchema();

    const rows = await crmQuery<MysqlRow>(
      `SELECT r.*, d.title as deal_title, d.assigned_to as agent_id, u.first_name, u.last_name
       FROM ratings r
       JOIN deals d ON d.id = r.deal_id
       LEFT JOIN users u ON u.id = d.assigned_to
       WHERE r.token = ? LIMIT 1`,
      [token]
    );

    if (!rows.length) return apiError("Invalid rating token", 404);

    const r = rows[0];
    const info: RatingInfoResponse = {
      id: String(r.id),
      agentId: String(r.agent_id || ""),
      agentName: `${r.first_name || ""} ${r.last_name || ""}`.trim() || "Skytech Agent",
      dealTitle: String(r.deal_title || "Project"),
      rated: r.score !== null && r.score !== undefined,
      rating: r.score ? Number(r.score) : null,
      feedback: r.feedback || null,
    };

    return apiSuccess(info);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const score = Number(body.rating);
    if (!score || score < 1 || score > 5) {
      return apiError("Score must be between 1 and 5", 400);
    }

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT r.*, d.assigned_to as agent_id FROM ratings r JOIN deals d ON d.id = r.deal_id WHERE r.token = ? LIMIT 1",
      [token]
    );
    if (!rows.length) return apiError("Invalid rating token", 404);

    const r = rows[0];
    await crmExecute(
      `UPDATE ratings SET
        score = ?,
        feedback = ?,
        client_name = COALESCE(?, client_name),
        submitted_at = NOW(),
        updated_at = NOW()
      WHERE id = ?`,
      [score, body.feedback || null, body.clientName || null, r.id]
    );

    const res: RatingSubmissionResponse = {
      id: String(r.id),
      agentId: String(r.agent_id || ""),
      dealId: String(r.deal_id),
      rating: score,
      feedback: body.feedback || null,
      clientName: body.clientName || r.client_name || null,
      ratedAt: new Date().toISOString(),
    };

    return apiSuccess(res, "Thank you for your rating!");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
