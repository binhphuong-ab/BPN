import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
);

export async function verifyToken(request: NextRequest): Promise<boolean> {
  try {
    // Try to get token from cookie first, then Authorization header
    let token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    }

    if (!token) {
      return false;
    }

    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check if token is valid and user is admin
    return payload.role === 'admin' && payload.username === 'nguyenbinhphuong';
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}
