import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import resolveSharedData from '../../../lib/sharedData';

const DATA_DIR = resolveSharedData();

export async function GET() {
  try {
    const filePath = path.join(DATA_DIR, 'settings.json');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      const defaultSettings = {
        contactEmail: 'info@skytech.example',
        contactPhone: '+233 000 000 000',
        whatsapp: '+233000000000',
        address: '',
        pricingBookletUrl: '',
      };
      fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2));
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('GET /api/content/settings error:', error);
    return NextResponse.json({ error: 'Failed to read settings data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(DATA_DIR, 'settings.json');
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/content/settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings data' }, { status: 500 });
  }
}
