import dbConnect from "./mongodb";
import Page from "../models/Page";

export type PageContent = Record<string, string>;

export async function getPageContent(): Promise<Record<string, PageContent>> {
  try {
    await dbConnect();
    const pageDoc = await Page.findOne({ name: "all_pages" }).lean();
    
    if (!pageDoc) {
      return {
        home: {},
        services: {},
        contact: {},
        about: {},
      };
    }
    
    return pageDoc.content as Record<string, PageContent>;
  } catch (error) {
    console.error("Failed to read page content from MongoDB:", error);
    return {
      home: {},
      services: {},
      contact: {},
      about: {},
    };
  }
}
