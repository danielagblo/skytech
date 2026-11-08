import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { DashboardOverview } from "@/types/dashboard.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const period = new URL(request.url).searchParams.get("period") || "today";
    const since =
      period === "this_week"
        ? "DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)"
        : period === "this_month"
          ? "DATE_FORMAT(CURDATE(), '%Y-%m-01')"
          : period === "three_months"
            ? "DATE_SUB(CURDATE(), INTERVAL 3 MONTH)"
            : "CURDATE()";

    // Top revenue per agent
    const revRows = await crmQuery<MysqlRow>(
      `SELECT d.assigned_to as userId, CONCAT(u.first_name, ' ', u.last_name) as name, SUM(d.total_paid) as revenue
       FROM deals d
       JOIN users u ON u.id = d.assigned_to
       WHERE d.deleted_at IS NULL
       GROUP BY d.assigned_to, u.first_name, u.last_name
       ORDER BY revenue DESC LIMIT 5`
    );

    const topRevenuePerAgent = revRows.map((r) => ({
      userId: String(r.userId),
      name: String(r.name || "Agent"),
      revenue: Number(r.revenue || 0),
    }));

    // Follow-up reminders
    const followUps = await crmQuery<MysqlRow>(
      `SELECT dl.deal_id as dealId, d.title as dealTitle, dl.follow_up_at as followUpAt, dl.log_type as type
       FROM deal_logs dl
       JOIN deals d ON d.id = dl.deal_id
       WHERE dl.follow_up_at IS NOT NULL AND dl.follow_up_at >= NOW()
       ORDER BY dl.follow_up_at ASC LIMIT 5`
    );

    const followUpReminders = followUps.map((r) => ({
      dealId: String(r.dealId),
      dealTitle: String(r.dealTitle),
      followUpAt: new Date(r.followUpAt).toISOString(),
      type: String(r.type || "FOLLOW_UP"),
    }));

    // Recent payments
    const payments = await crmQuery<MysqlRow>(
      `SELECT dl.deal_id as dealId, d.title as dealTitle, dl.amount_paid as amount, dl.created_at as paidAt
       FROM deal_logs dl
       JOIN deals d ON d.id = dl.deal_id
       WHERE dl.amount_paid IS NOT NULL AND dl.amount_paid > 0
       ORDER BY dl.created_at DESC LIMIT 5`
    );

    const recentPayments = payments.map((r) => ({
      dealId: String(r.dealId),
      dealTitle: String(r.dealTitle),
      amount: Number(r.amount || 0),
      paidAt: new Date(r.paidAt).toISOString(),
    }));

    const activityRows = await crmQuery<MysqlRow>(
      `SELECT
         COUNT(*) AS total,
         SUM(contact_mode = 'PHONE_CALL') AS phoneCalls,
         SUM(contact_mode = 'WHATSAPP') AS whatsapp,
         SUM(contact_mode = 'EMAIL') AS email,
         SUM(contact_mode = 'IN_PERSON') AS inPerson,
         SUM(follow_up_at IS NOT NULL) AS followUps,
         SUM(IFNULL(amount_paid, 0) > 0) AS payments
       FROM deal_logs
       WHERE created_at >= ${since}`,
    );
    const activityRow = activityRows[0] || {};
    const totalLogs = Number(activityRow.total || 0);
    const followUpsLogged = Number(activityRow.followUps || 0);
    const activity = {
      total: totalLogs,
      phoneCalls: Number(activityRow.phoneCalls || 0),
      whatsapp: Number(activityRow.whatsapp || 0),
      email: Number(activityRow.email || 0),
      inPerson: Number(activityRow.inPerson || 0),
      followUps: followUpsLogged,
      payments: Number(activityRow.payments || 0),
      followUpRate: totalLogs ? Math.round((followUpsLogged / totalLogs) * 100) : 0,
    };

    const overview: DashboardOverview = {
      activity,
      topRevenuePerAgent,
      executivePerformance: topRevenuePerAgent.map((agent, idx) => ({
        userId: agent.userId,
        name: agent.name,
        profilePhotoUrl: null,
        closedDeals: 1,
        revenue: agent.revenue,
        conversionRate: 85,
        rating: 4.8,
        rank: idx + 1,
        score: 90,
      })),
      followUpReminders,
      recentPayments,
      agentRank: {
        rank: 1,
        totalAgents: Math.max(1, topRevenuePerAgent.length),
        loggedCallSeconds: 0,
        activeSessionSeconds: 0,
        targetAchievement: 100,
        salesRevenue: topRevenuePerAgent.reduce((acc, curr) => acc + curr.revenue, 0),
      },
    };

    return apiSuccess(overview);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
