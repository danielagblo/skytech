import dbConnect from "./mongodb";
import Affiliate from "../models/Affiliate";
import { deleteFromS3 } from "./s3";

export interface IAffiliate {
  _id?: string;
  name: string;
  logoUrl: string;
  order?: number;
}

export async function getAffiliates(): Promise<IAffiliate[]> {
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
  try {
    await dbConnect();
    
    // Cleanup orphaned images
    const existing = await Affiliate.find({}).lean();
    const newUrls = new Set(affiliates.map(a => a.logoUrl));
    
    for (const item of existing) {
      if (item.logoUrl && !newUrls.has(item.logoUrl)) {
        await deleteFromS3(item.logoUrl);
      }
    }

    await Affiliate.deleteMany({});
    if (affiliates.length > 0) {
      await Affiliate.insertMany(affiliates.map((a, idx) => ({
        name: a.name,
        logoUrl: a.logoUrl,
        order: idx
      })));
    }
  } catch (error) {
    console.error("Error saving affiliates:", error);
    throw error;
  }
}

