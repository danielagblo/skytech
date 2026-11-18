import { NextResponse } from "next/server";
import { getFilmServices, saveFilmServices, type FilmServicesContent } from "@/app/lib/services";

export async function GET() {
  try {
    const content = await getFilmServices();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to read services:", error);
    return NextResponse.json({ error: "Failed to read services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FilmServicesContent;
    await saveFilmServices(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save services:", error);
    return NextResponse.json({ error: "Failed to save services" }, { status: 500 });
  }
}
