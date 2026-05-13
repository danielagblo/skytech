import dbConnect from "./mongodb";
import Affiliate from "../models/Affiliate";

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
    return JSON.parse(JSON.stringify(affiliates));
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return [];
  }
}

export async function saveAffiliates(affiliates: IAffiliate[]): Promise<void> {
  try {
    await dbConnect();
    // For simplicity, we'll replace the whole set, or you could do individual upserts.
    // Given the small number of partners, replacing is often easier for a "sync" operation.
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
