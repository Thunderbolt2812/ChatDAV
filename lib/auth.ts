
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function registerUser(email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials.');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials.');
  }

  return user;
}

export function generateToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined.");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}
