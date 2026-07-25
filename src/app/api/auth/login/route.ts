import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/lib/auth';

// Demo users for initial setup (in production, use database only)
const DEMO_USERS = [
  {
    id: 1,
    email: 'user@pastureai.et',
    password: 'user12345',
    name: 'Ahmed Ibrahim',
    role: 'USER',
    region: 'Somali Region',
    zone: 'Shabelle',
    woreda: 'Mustahil'
  },
  {
    id: 2,
    email: 'ngo@pastureai.et',
    password: 'ngo12345',
    name: 'Dr. Fatima Hassan',
    role: 'NGO',
    organization: 'FAO Ethiopia',
    region: 'Somali Region',
    zone: 'Jijiga',
    woreda: 'Jijiga'
  },
  {
    id: 3,
    email: 'gov@pastureai.et',
    password: 'gov12345',
    name: 'Kebede Tadesse',
    role: 'GOVERNMENT',
    organization: 'NDRMC',
    region: 'Oromia Region',
    zone: 'Borena',
    woreda: 'Yabelo'
  },
  {
    id: 4,
    email: 'admin@pastureai.et',
    password: 'admin12345',
    name: 'System Administrator',
    role: 'ADMIN',
    organization: 'PastureAI Team'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check demo users
    let user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      name: user.name
    });

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
      region: user.region,
      zone: user.zone,
      woreda: user.woreda
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
