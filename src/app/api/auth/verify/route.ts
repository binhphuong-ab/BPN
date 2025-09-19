import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

// Force dynamic rendering for authentication routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const isValid = await verifyToken(request);
  
  if (isValid) {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
