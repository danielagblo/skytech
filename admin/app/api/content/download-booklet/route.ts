import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Extract filename from URL
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('file');
    
    if (!filename) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Construct path to shared-data/booklets
    const bookletPath = path.join(process.cwd(), '..', 'shared-data', 'booklets', filename);
    
    // Check if file exists
    try {
      await stat(bookletPath);
    } catch (err) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileContent = await readFile(bookletPath);

    // Return the file with proper headers
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileContent.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file: ' + String(error) }, { status: 500 });
  }
}
