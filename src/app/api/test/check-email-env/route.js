import { NextResponse } from 'next/server';

// GET /api/test/check-email-env - Check email environment variables
export async function GET() {
  const envStatus = {
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || null,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || null,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || null,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ? 'SET (hidden)' : null,
    EMAIL_FROM: process.env.EMAIL_FROM || null,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || null,
    JWT_SECRET: process.env.JWT_SECRET ? 'SET (hidden)' : null,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };

  const allSet = Object.entries(envStatus).every(([key, value]) => {
    if (key.includes('PASSWORD') || key.includes('SECRET')) {
      return value === 'SET (hidden)';
    }
    return value !== null;
  });

  return NextResponse.json({
    allConfigured: allSet,
    environment: envStatus,
    missing: Object.entries(envStatus)
      .filter(([key, value]) => value === null)
      .map(([key]) => key),
    timestamp: new Date().toISOString()
  });
}

