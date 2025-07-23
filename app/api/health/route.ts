import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    project: 'illunare-landing',
    version: '1.0.4',
    timestamp: new Date().toISOString()
  });
} 