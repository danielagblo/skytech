import { isMysql } from "./db";
import * as mysql from "./mysql";
import dbConnect from "./mongodb";
import InternshipSubmission from "../models/InternshipSubmission";

export interface IEnrolledIntern {
  _id?: string;
  name: string;
  university: string;
  cohort: string;
  image?: string;
}

async function getEnrolledInternsMysql(): Promise<IEnrolledIntern[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, data, submitted_at FROM internship_submissions WHERE enrolled = 1 ORDER BY submitted_at DESC",
  );
  return rows
    .map((s) => {
      const data = mysql.parseJson<Record<string, any>>(s.data) || {};
      return {
        _id: s.id,
        name: data.fullName || data.name || "",
        university: data.institutionType || data.school || "",
        cohort: data.programOffering || data.program || "Skytech Ghana Intern",
        image: data.image || "",
      };
    })
    .filter((i) => i.name && i.name.trim().length > 0);
}

export async function getEnrolledInterns(): Promise<IEnrolledIntern[]> {
  if (isMysql()) {
    try {
      return await getEnrolledInternsMysql();
    } catch (error) {
      console.error("Error fetching enrolled interns (mysql):", error);
      return [];
    }
  }
  try {
    await dbConnect();
    const submissions = await InternshipSubmission.find({ enrolled: true })
      .sort({ submittedAt: -1 })
      .lean();

    if (!submissions || submissions.length === 0) {
      console.log("No enrolled interns found in database.");
      return [];
    }

    return (submissions as any[])
      .map((s) => ({
        _id: (s._id && s._id.toString ? s._id.toString() : s.id) || undefined,
        name: s.fullName || s.name || "",
        university: s.institutionType || s.school || "",
        cohort: s.programOffering || s.program || "Skytech Ghana Intern",
        image: s.image || "",
      }))
      .filter((i) => i.name && i.name.trim().length > 0);
  } catch (error) {
    console.error("Error fetching enrolled interns:", error);
    return [];
  }
}