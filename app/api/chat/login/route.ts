import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticateUser, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    const token = generateToken(user._id.toString());
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid credentials.' }, { status: 401 });
  }
}
