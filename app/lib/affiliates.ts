import { isMysql } from "./db";
import * as mysql from "./mysql";
import { deleteImage } from "./storage";
import dbConnect from "./mongodb";
import Affiliate from "../models/Affiliate";

export interface IAffiliate {
  _id?: string;
  name: string;
  logoUrl: string;
  order?: number;
  colSpan?: number;
  rowSpan?: number;
  visible?: boolean;
}

async function getAffiliatesMysql(): Promise<IAffiliate[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, name, logo_url, sort_order, col_span, row_span, visible FROM affiliates ORDER BY sort_order ASC, created_at DESC",
  );
  return rows.map((r) => ({
    _id: r.id,
    name: r.name || "",
    logoUrl: r.logo_url || "",
    order: r.sort_order ?? 0,
    colSpan: r.col_span ?? 1,
    rowSpan: r.row_span ?? 1,
    visible: r.visible !== undefined ? Boolean(r.visible) : true,
  }));
}

async function saveAffiliatesMysql(affiliates: IAffiliate[]): Promise<void> {
  await mysql.initSchema();

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
    await mysql.insert("affiliates", {
      name: a.name,
      logo_url: a.logoUrl,
      sort_order: idx,
      col_span: a.colSpan ?? 1,
      row_span: a.rowSpan ?? 1,
      visible: a.visible !== false ? 1 : 0,
    });
  }
}

export async function getAffiliates(): Promise<IAffiliate[]> {
  if (isMysql()) {
    try {
      return await getAffiliatesMysql();
    } catch (error) {
      console.error("Error fetching affiliates (mysql):", error);
      return [];
    }
  }
  try {
    await dbConnect();
    const affiliates = await Affiliate.find({}).sort({ order: 1, createdAt: -1 }).lean();
    
    if (!affiliates || affiliates.length === 0) {
      console.log("No affiliates found in database.");
      return [];
    }

    return JSON.parse(JSON.stringify(affiliates));
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return [];
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
        visible: a.visible !== false,
      })));
    }

  } catch (error) {
    console.error("Error saving affiliates:", error);
    throw error;
  }
}