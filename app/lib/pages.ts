import fs from "fs";
import path from "path";
import resolveSharedData from "./sharedData";

export type PageContent = Record<string, string>;

export function getPageContent(): Record<string, PageContent> {
  try {
    const filePath = path.join(resolveSharedData(), "pages.json");
    if (!fs.existsSync(filePath)) {
      return {
        home: {},
        services: {},
        contact: {},
        about: {},
      };
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read page content:", error);
    return {
      home: {},
      services: {},
      contact: {},
      about: {},
    };
  }
}
