import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export async function withAuth(
  handler: (request: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params: Record<string, string> }) => {
    try {
      // Check authentication
      const isValid = await verifyToken(request);
      
      if (!isValid) {
        return NextResponse.json(
          { message: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }

      // If authenticated, call the original handler
      return handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}
