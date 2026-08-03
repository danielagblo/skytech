import dbConnect from "./mongodb";
import InternshipSubmission from "../models/InternshipSubmission";

export interface IEnrolledIntern {
  _id?: string;
  name: string;
  university: string;
  cohort: string;
}

export async function getEnrolledInterns(): Promise<IEnrolledIntern[]> {
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
        name: s.name || "",
        university: s.school || "",
        cohort: s.program || "Skytech Ghana Intern",
      }))
      .filter((i) => i.name && i.name.trim().length > 0);
  } catch (error) {
    console.error("Error fetching enrolled interns:", error);
    return [];
  }
}
