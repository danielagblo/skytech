import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const SUBMISSIONS_FILE = path.join(process.cwd(), '..', 'shared-data', 'contact-submissions.json');

async function ensureSubmissionsFile() {
  try {
    await readFile(SUBMISSIONS_FILE);
  } catch {
    await mkdir(path.dirname(SUBMISSIONS_FILE), { recursive: true });
    await writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    await ensureSubmissionsFile();
    
    const submission = await request.json();
    
    // Read existing submissions
    const fileContent = await readFile(SUBMISSIONS_FILE, 'utf-8');
    const submissions = JSON.parse(fileContent);
    
    // Add new submission
    submissions.push({
      id: Date.now(),
      ...submission,
    });
    
    // Write back to file
    await writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    
    return NextResponse.json({ success: true, id: submissions[submissions.length - 1].id }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to save submission:', error);
    return NextResponse.json({ error: 'Failed to save submission: ' + String(error) }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureSubmissionsFile();
    
    const fileContent = await readFile(SUBMISSIONS_FILE, 'utf-8');
    const submissions = JSON.parse(fileContent);
    
    return NextResponse.json(submissions, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500, headers: corsHeaders });
  }
}
