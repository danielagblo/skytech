import "dotenv/config";
import fs from "fs";
import path from "path";
import dbConnect from "./mongodb";
import resolveSharedData from "./sharedData";
import Service from "../models/Service";
import TeamMember from "../models/TeamMember";
import Testimonial from "../models/Testimonial";
import Settings from "../models/Settings";
import Page from "../models/Page";

async function seed() {
  const connection = await dbConnect();
  const dbHost = connection.connection.host;
  console.log(`Connecting to MongoDB host: ${dbHost}`);
  const DATA_DIR = resolveSharedData();

  const files = {
    "services.json": Service,
    "team.json": TeamMember,
    "testimonials.json": Testimonial,
    "settings.json": Settings,
    "pages.json": Page,
  };

  for (const [filename, Model] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        
        // Special handling for Page which is stored differently
        if (filename === "pages.json") {
          await Page.findOneAndUpdate(
            { name: "all_pages" },
            { content: data },
            { upsert: true }
          );
        } else if (filename === "settings.json") {
          await Settings.deleteMany({});
          await Settings.create(data);
        } else if (Array.isArray(data)) {
          await Model.deleteMany({});
          if (data.length > 0) {
            await Model.insertMany(data);
          }
        }
        console.log(`Seeded ${filename} successfully.`);
      } catch (error) {
        console.error(`Failed to seed ${filename}:`, error);
      }
    }
  }

  process.exit(0);
}

seed();
