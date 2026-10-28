import { NextRequest, NextResponse } from "next/server";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    await initCrmSchema();
    const body = await request.json();

    const fullName = (body.fullName || body.name || "").trim();
    let firstName = body.firstName;
    let lastName = body.lastName;

    if (!firstName && fullName) {
      const parts = fullName.split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    const email = body.email || null;
    const phone = body.phone || body.phone1 || null;
    const companyName = body.companyName || body.company || null;
    const description = body.description || body.message || body.service || null;
    const source = body.source || body.leadSource || "WEBSITE";

    const leadId = newId();

    await crmExecute(
      `INSERT INTO leads (
        id, first_name, last_name, email, phone_1,
        company_name, description, lead_source, priority, status,
        conversion_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'HIGH', 'NEW', 50)`,
      [
        leadId,
        firstName || "Web",
        lastName || "Lead",
        email,
        phone,
        companyName,
        description,
        source,
      ]
    );

    const created = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [leadId]);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: leadId,
          firstName: created[0].first_name,
          lastName: created[0].last_name,
          email: created[0].email,
          phone: created[0].phone_1,
        },
        message: "Lead submitted successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[Public Landing Page Lead Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit lead",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
