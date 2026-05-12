import fs from "fs";
import { resolveSharedData } from "./sharedData";

export type PageContent = Record<string, string>;

export async function getPageContent(): Promise<Record<string, PageContent>> {
  try {
    const filePath = resolveSharedData("pages.json");
    if (!fs.existsSync(filePath)) {
      console.warn("pages.json not found, using defaults");
      return getDefaultPages();
    }
    
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read page content from local file:", error);
    return getDefaultPages();
  }
}

function getDefaultPages() {
  return {
    home: {},
    services: {},
    contact: {},
    about: {},
  };
}
