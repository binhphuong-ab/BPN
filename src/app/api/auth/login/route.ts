import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Force dynamic rendering for authentication routes
export const dynamic = 'force-dynamic';

// Admin credentials (in production, these should be stored securely in environment variables)
const ADMIN_USERNAME = 'nguyenbinhphuong';
const ADMIN_PASSWORD = 'Minato123';

// JWT secret (in production, this should be a strong secret from environment variables)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = password === ADMIN_PASSWORD;
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({ 
      username: ADMIN_USERNAME,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Set secure cookie
    const response = NextResponse.json({ 
      message: 'Login successful',
      token,
      user: { username: ADMIN_USERNAME, role: 'admin' }
    });

    // Set HTTP-only cookie for better security
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
