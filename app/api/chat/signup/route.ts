import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await registerUser(email, password);
    const token = generateToken(user._id.toString());
    return NextResponse.json({ token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating user.' }, { status: 400 });
  }
}
