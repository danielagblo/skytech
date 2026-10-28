import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatDeal } from "@/lib/crm/formatters";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const size = Math.max(1, Math.min(100, parseInt(url.searchParams.get("size") || "20", 10)));
    const search = url.searchParams.get("search")?.trim();
    const stage = url.searchParams.get("stage")?.trim();
    const priority = url.searchParams.get("priority")?.trim();
    const assignee = url.searchParams.get("assignee")?.trim();

    let whereSql = "WHERE deleted_at IS NULL";
    const params: any[] = [];

    if (search) {
      whereSql += " AND title LIKE ?";
      params.push(`%${search}%`);
    }
    if (stage) {
      whereSql += " AND stage = ?";
      params.push(stage);
    }
    if (priority) {
      whereSql += " AND priority = ?";
      params.push(priority);
    }
    if (assignee) {
      whereSql += " AND assigned_to = ?";
      params.push(assignee);
    }

    const countRows = await crmQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM deals ${whereSql}`,
      params
    );
    const totalElements = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalElements / size);

    const offset = page * size;
    const rows = await crmQuery<MysqlRow>(
      `SELECT * FROM deals ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    const content = rows.map(formatDeal);

    return apiSuccess({
      content,
      page,
      size,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch deals", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const dealId = newId();

    const contractValue = body.contractValue || 0;
    const totalPaid = body.totalPaid || 0;
    const arrears = Math.max(0, contractValue - totalPaid);
    const isPaidInFull = arrears === 0 && contractValue > 0;

    await crmExecute(
      `INSERT INTO deals (
        id, company_id, lead_id, created_by, assigned_to,
        title, stage, priority, contract_value, total_paid, arrears,
        is_paid_in_full, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dealId,
        user.companyId || null,
        body.leadId || null,
        user.id,
        body.assignedToId || user.id,
        body.title || "Untitled Deal",
        body.stage || "PROSPECTING",
        body.priority || "MEDIUM",
        contractValue,
        totalPaid,
        arrears,
        isPaidInFull ? 1 : 0,
        body.notes || null,
      ]
    );

    const created = await crmQuery<MysqlRow>("SELECT * FROM deals WHERE id = ?", [dealId]);
    return apiSuccess(formatDeal(created[0]), "Deal created successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create deal", 500);
  }
}
