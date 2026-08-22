import { isMysql } from "./db";
import * as mysql from "./mysql";
import { deleteImage } from "./storage";
import dbConnect from "./mongodb";
import Affiliate from "../models/Affiliate";
import { DEFAULT_PARTNERS } from "./defaultPartners";

export interface IAffiliate {
  _id?: string;
  name: string;
  logoUrl: string;
  order?: number;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

function buildAffiliateSelect(columns: Set<string>): string {
  const fields = ["id", "name", "logo_url", "sort_order"];
  if (columns.has("col_span")) fields.push("col_span");
  if (columns.has("row_span")) fields.push("row_span");
  if (columns.has("logo_scale")) fields.push("logo_scale");
  if (columns.has("visible")) fields.push("visible");
  return fields.join(", ");
}

function mapAffiliateRow(r: Record<string, unknown>): IAffiliate {
  return {
    _id: r.id as string,
    name: (r.name as string) || "",
    logoUrl: (r.logo_url as string) || "",
    order: (r.sort_order as number) ?? 0,
    colSpan: r.col_span !== undefined ? Number(r.col_span) : 1,
    rowSpan: r.row_span !== undefined ? Number(r.row_span) : 1,
    logoScale: r.logo_scale !== undefined ? Number(r.logo_scale) : 100,
    visible: r.visible !== undefined ? Boolean(r.visible) : true,
  };
}

function buildAffiliateInsert(
  a: IAffiliate,
  idx: number,
  columns: Set<string>,
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    name: a.name,
    logo_url: a.logoUrl,
    sort_order: idx,
  };
  if (columns.has("col_span")) record.col_span = a.colSpan ?? 1;
  if (columns.has("row_span")) record.row_span = a.rowSpan ?? 1;
  if (columns.has("logo_scale")) record.logo_scale = a.logoScale ?? 100;
  if (columns.has("visible")) record.visible = a.visible !== false ? 1 : 0;
  return record;
}

async function getAffiliatesMysql(): Promise<IAffiliate[]> {
  await mysql.initSchema();
  const columns = await mysql.getTableColumns("affiliates");
  const rows = await mysql.query(
    `SELECT ${buildAffiliateSelect(columns)} FROM affiliates ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows.map(mapAffiliateRow);
}

async function saveAffiliatesMysql(affiliates: IAffiliate[]): Promise<void> {
  await mysql.initSchema();
  const columns = await mysql.getTableColumns("affiliates");

  const existing = await mysql.query("SELECT id, logo_url FROM affiliates");
  const newUrls = new Set(affiliates.map((a) => a.logoUrl));

  for (const item of existing) {
    if (item.logo_url && !newUrls.has(item.logo_url)) {
      await deleteImage(item.logo_url);
    }
  }

  const validAffiliates = affiliates.filter((a) => a.name && a.name.trim());

  await mysql.clear("affiliates");
  for (let idx = 0; idx < validAffiliates.length; idx++) {
    const a = validAffiliates[idx];
    await mysql.insert("affiliates", buildAffiliateInsert(a, idx, columns));
  }
}

export async function getAffiliates(): Promise<IAffiliate[]> {
  if (isMysql()) {
    try {
      const affiliates = await getAffiliatesMysql();
      return affiliates.length > 0 ? affiliates : DEFAULT_PARTNERS;
    } catch (error) {
      console.error("Error fetching affiliates (mysql):", error);
      return DEFAULT_PARTNERS;
    }
  }
  try {
    await dbConnect();
    const affiliates = await Affiliate.find({}).sort({ order: 1, createdAt: -1 }).lean();
    
    if (!affiliates || affiliates.length === 0) {
      console.log("No affiliates found in database.");
      return DEFAULT_PARTNERS;
    }

    return JSON.parse(JSON.stringify(affiliates));
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return DEFAULT_PARTNERS;
  }
}

export async function saveAffiliates(affiliates: IAffiliate[]): Promise<void> {
  if (isMysql()) {
    await saveAffiliatesMysql(affiliates);
    return;
  }
  try {
    await dbConnect();
    
    // Cleanup orphaned images
    const existing = await Affiliate.find({}).lean();
    const newUrls = new Set(affiliates.map(a => a.logoUrl));
    
    for (const item of existing) {
      if (item.logoUrl && !newUrls.has(item.logoUrl)) {
        await deleteImage(item.logoUrl);
      }
    }

    const validAffiliates = affiliates.filter(a => a.name.trim());

    await Affiliate.deleteMany({});
    if (validAffiliates.length > 0) {
      await Affiliate.insertMany(validAffiliates.map((a, idx) => ({
        name: a.name,
        logoUrl: a.logoUrl,
        order: idx,
        colSpan: a.colSpan ?? 1,
        rowSpan: a.rowSpan ?? 1,
        logoScale: a.logoScale ?? 100,
        visible: a.visible !== false,
      })));
    }

  } catch (error) {
    console.error("Error saving affiliates:", error);
    throw error;
  }
}
