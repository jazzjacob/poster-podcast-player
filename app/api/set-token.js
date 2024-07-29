// pages/api/set-token.js
import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../firebaseAdmin'; // Import your Firebase Admin SDK functions

export async function POST(request) {
  try {
    const { token } = await request.json();

    // Verify the token with Firebase Admin SDK
    const decodedToken = await verifyIdToken(token);

    // Set the token in an HttpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
      sameSite: 'Strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ success: false, error: 'Invalid token' });
  }
}
