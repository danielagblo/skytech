import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

// Get the dist folder path - it's at the root of the project
const publicDir = join(process.cwd(), '..', '..', 'dist');

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    let filePath = params.path ? params.path.join('/') : 'index.html';
    
    // Try to serve the file
    let fullPath = join(publicDir, filePath);
    
    try {
      const content = await readFile(fullPath);
      
      // Determine content type
      let contentType = 'text/plain';
      if (filePath.endsWith('.html')) contentType = 'text/html';
      else if (filePath.endsWith('.js')) contentType = 'application/javascript';
      else if (filePath.endsWith('.css')) contentType = 'text/css';
      else if (filePath.endsWith('.json')) contentType = 'application/json';
      else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (filePath.endsWith('.png')) contentType = 'image/png';
      else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      
      return new NextResponse(content, {
        headers: { 'Content-Type': contentType }
      });
    } catch {
      // If file not found, try index.html (for SPA routing)
      fullPath = join(publicDir, 'index.html');
      const content = await readFile(fullPath);
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
