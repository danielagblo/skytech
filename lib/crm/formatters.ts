import { MysqlRow } from "./db";
import { Lead } from "@/types/lead.types";
import { Deal, DealLog } from "@/types/deal.types";
import { Task } from "@/types/task.types";
import { Invoice } from "@/types/invoice.types";
import { CalendarEvent } from "@/types/calendar.types";
import { AppNotification } from "@/types/notification.types";
import { Broadcast } from "@/types/broadcast.types";
import { Automation } from "@/types/automation.types";
import { TaskStatus } from "@/types/api.types";

export function formatLead(row: MysqlRow): Lead {
  let assignedTo: string[] = [];
  if (Array.isArray(row.assigned_to)) {
    assignedTo = row.assigned_to;
  } else if (typeof row.assigned_to === "string") {
    try {
      assignedTo = JSON.parse(row.assigned_to);
    } catch {
      assignedTo = [];
    }
  }

  return {
    id: String(row.id),
    companyId: row.company_id ? String(row.company_id) : "",
    assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
    createdById: row.created_by ? String(row.created_by) : "",
    firstName: row.first_name || null,
    lastName: row.last_name || null,
    email: row.email || null,
    phone1: row.phone_1 || null,
    phone2: row.phone_2 || null,
    whatsapp: row.whatsapp || null,
    companyName: row.company_name || null,
    role: row.role || null,
    address: row.address || null,
    industry: row.industry || null,
    category: row.category || null,
    leadSource: row.lead_source || null,
    priority: row.priority || "MEDIUM",
    status: row.status || "NEW",
    launchTimeline: row.launch_timeline || null,
    hasPublicOffice: Boolean(row.has_public_office),
    meetingArranged: Boolean(row.meeting_arranged),
    birthday: row.birthday ? new Date(row.birthday).toISOString().slice(0, 10) : null,
    smsOptIn: Boolean(row.sms_opt_in),
    emailOptIn: Boolean(row.email_opt_in),
    newsletterOptIn: Boolean(row.newsletter_opt_in),
    description: row.description || null,
    conversionScore: Number(row.conversion_score || 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatDeal(row: MysqlRow): Deal {
  return {
    id: String(row.id),
    companyId: row.company_id ? String(row.company_id) : "",
    leadId: row.lead_id ? String(row.lead_id) : null,
    createdById: row.created_by ? String(row.created_by) : "",
    assignedToId: row.assigned_to ? String(row.assigned_to) : null,
    title: row.title || "",
    stage: row.stage || "PROSPECTING",
    priority: row.priority || "MEDIUM",
    contractValue: Number(row.contract_value || 0),
    totalPaid: Number(row.total_paid || 0),
    arrears: Number(row.arrears || 0),
    paidInFull: Boolean(row.is_paid_in_full),
    hostingExpiry: row.hosting_expiry ? new Date(row.hosting_expiry).toISOString().slice(0, 10) : null,
    domainExpiry: row.domain_expiry ? new Date(row.domain_expiry).toISOString().slice(0, 10) : null,
    maintenanceExpiry: row.maintenance_expiry ? new Date(row.maintenance_expiry).toISOString().slice(0, 10) : null,
    hostingCost: Number(row.hosting_cost || 0),
    domainCost: Number(row.domain_cost || 0),
    maintenanceCost: Number(row.maintenance_cost || 0),
    notes: row.notes || null,
    version: Number(row.version || 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatTask(row: MysqlRow, assigneeIds: string[] = []): Task {
  return {
    id: String(row.id),
    companyId: row.company_id ? String(row.company_id) : "",
    title: row.title || "",
    description: row.description || null,
    status: (row.status || "TODO") as TaskStatus,
    priority: row.priority || "MEDIUM",
    createdById: row.created_by ? String(row.created_by) : "",
    allowReminder: Boolean(row.allow_reminder),
    linkedLeadId: row.linked_lead_id ? String(row.linked_lead_id) : null,
    linkedDealId: row.linked_deal_id ? String(row.linked_deal_id) : null,
    dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
    assigneeIds,
    completionReason: row.completion_reason || null,
    version: Number(row.version || 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatInvoice(row: MysqlRow, items: MysqlRow[] = [], payments: MysqlRow[] = []): Invoice {
  return {
    id: String(row.id),
    companyId: row.company_id ? String(row.company_id) : undefined,
    dealId: String(row.deal_id),
    createdById: row.created_by ? String(row.created_by) : undefined,
    invoiceNumber: row.invoice_number || null,
    status: row.status || "DRAFT",
    recipientName: row.recipient_name || "",
    recipientCompany: row.recipient_company || null,
    recipientEmail: row.recipient_email || null,
    recipientAddress: row.recipient_address || null,
    dueDate: row.due_date ? new Date(row.due_date).toISOString().slice(0, 10) : null,
    issueDate: row.issue_date ? new Date(row.issue_date).toISOString().slice(0, 10) : null,
    currency: "GHS",
    taxRate: Number(row.tax_rate || 0),
    discountAmount: Number(row.discount_amount || 0),
    subtotal: Number(row.subtotal || 0),
    taxAmount: Number(row.tax_amount || 0),
    total: Number(row.total || 0),
    amountPaid: Number(row.amount_paid || 0),
    balanceDue: Number(row.balance_due || 0),
    notes: row.notes || null,
    terms: row.terms || null,
    version: Number(row.version || 0),
    receptionConfirmed: Boolean(row.reception_confirmed),
    lastSendError: row.last_send_error || null,
    items: items.map((it) => ({
      id: String(it.id),
      description: it.description || "",
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unit_price || 0),
      lineTotal: Number(it.amount || 0),
    })),
    payments: payments.map((p) => ({
      id: String(p.id),
      amount: Number(p.amount || 0),
      paymentMode: p.payment_mode || "MOMO",
      reference: p.reference || null,
      paidAt: p.paid_at ? new Date(p.paid_at).toISOString() : new Date().toISOString(),
      recordedById: p.recorded_by ? String(p.recorded_by) : undefined,
    })),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function formatEvent(row: MysqlRow): CalendarEvent {
  return {
    id: String(row.id),
    title: row.title || "",
    description: row.description || null,
    ownerId: row.created_by ? String(row.created_by) : "",
    linkedLeadId: row.lead_id ? String(row.lead_id) : null,
    linkedDealId: row.deal_id ? String(row.deal_id) : null,
    startTime: row.start_time ? new Date(row.start_time).toISOString() : new Date().toISOString(),
    endTime: row.end_time ? new Date(row.end_time).toISOString() : new Date().toISOString(),
    eventType: row.event_type || "MEETING",
    assignees: row.assigned_to ? [String(row.assigned_to)] : [],
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatNotification(row: MysqlRow): AppNotification {
  return {
    id: String(row.id),
    type: "GENERAL",
    title: row.title || "Notification",
    body: row.body || "",
    href: row.link || null,
    read: Boolean(row.is_read),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatBroadcast(row: MysqlRow): Broadcast {
  return {
    id: String(row.id),
    name: row.title || "Broadcast",
    messageContent: row.message || "",
    channel: (row.channel || "SMS") as any,
    status: (row.status || "DRAFT") as any,
    recipientCount: Number(row.recipient_count || 0),
    segmentFilter: {},
    createdById: row.created_by ? String(row.created_by) : "",
    scheduledAt: row.scheduled_for ? new Date(row.scheduled_for).toISOString() : null,
    sentAt: row.sent_at ? new Date(row.sent_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatDealLog(row: MysqlRow): DealLog {
  return {
    id: String(row.id),
    dealId: String(row.deal_id),
    createdById: row.created_by ? String(row.created_by) : "",
    logType: row.log_type || "NEGOTIATION",
    contactMode: row.contact_mode || null,
    responseType: row.response_type || null,
    callDirection: null,
    callDurationSeconds: null,
    callOutcome: null,
    followUpAt: row.follow_up_at ? new Date(row.follow_up_at).toISOString() : null,
    settlementValue: row.settlement_value ? Number(row.settlement_value) : null,
    settlementFollowUp: row.settlement_follow_up ? new Date(row.settlement_follow_up).toISOString() : null,
    specialConditions: row.special_conditions || null,
    amountPaid: row.amount_paid ? Number(row.amount_paid) : null,
    paymentMode: row.payment_mode || null,
    invoiceNumber: row.invoice_number || null,
    receiptNumber: row.receipt_number || null,
    invoiceIssued: Boolean(row.invoice_issued),
    serviceType: row.service_type || null,
    expiryDate: row.expiry_date ? new Date(row.expiry_date).toISOString().slice(0, 10) : null,
    retentionAmount: row.retention_amount ? Number(row.retention_amount) : null,
    retentionInvoice: row.retention_invoice || null,
    retentionReceipt: row.retention_receipt || null,
    autoReviewScore: row.auto_review_score || null,
    body: row.body || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function formatAutomation(row: MysqlRow): Automation {
  let cfg: any = {};
  if (typeof row.config === "string") {
    try { cfg = JSON.parse(row.config); } catch {}
  } else if (typeof row.config === "object" && row.config !== null) {
    cfg = row.config;
  }

  return {
    id: String(row.id),
    automationType: (row.trigger_type || "BIRTHDAY") as any,
    name: row.name || "Untitled Automation",
    active: Boolean(row.is_active),
    triggerConfig: cfg.triggerConfig || {},
    contactIds: cfg.contactIds || [],
    steps: cfg.steps || [],
    createdById: row.created_by ? String(row.created_by) : "",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}
