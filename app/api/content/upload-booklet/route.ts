import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory in shared-data (accessible by both admin and public site)
    const uploadsDir = resolveSharedData('booklets');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Save file with a timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `pricing-booklet-${timestamp}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    // Return the URL relative to the shared-data folder
    const url = `/shared-data/booklets/${filename}`;

    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
