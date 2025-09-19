import { NextResponse } from 'next/server';

// Force dynamic rendering for authentication routes  
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logout successful' });
    
    // Clear the authentication cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
