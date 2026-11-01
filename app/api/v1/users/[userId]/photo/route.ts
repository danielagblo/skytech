import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError, formatUser } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import fs from "fs/promises";
import path from "path";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    await initCrmSchema();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return apiError("No file provided", 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let photoUrl = "";
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      await fs.mkdir(uploadDir, { recursive: true });
      const ext = path.extname(file.name) || ".jpg";
      const filename = `avatar-${userId}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      photoUrl = `/uploads/avatars/${filename}`;
    } catch {
      const mime = file.type || "image/jpeg";
      photoUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    await crmExecute("UPDATE users SET profile_photo_url = ?, updated_at = NOW() WHERE id = ?", [
      photoUrl,
      userId,
    ]);

    const updatedRows = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!updatedRows.length) return apiError("User not found", 404);

    return apiSuccess(formatUser(updatedRows[0]), "Photo updated successfully");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
