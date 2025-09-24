import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT /api/admin/scouts/verify - Verify/unverify scout (admin only)
export const PUT = requireRole(['admin'])(async (req) => {
  try {
    const { scout_id, verified } = await req.json();

    if (!scout_id || verified === undefined) {
      return NextResponse.json(
        { error: 'Scout ID and verified status are required' },
        { status: 400 }
      );
    }

    // Check if scout exists
    const existingScout = await prisma.scout.findUnique({
      where: { scout_id: parseInt(scout_id) },
      include: {
        user: {
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });

    if (!existingScout) {
      return NextResponse.json(
        { error: 'Scout not found' },
        { status: 404 }
      );
    }

    const updatedScout = await prisma.scout.update({
      where: { scout_id: parseInt(scout_id) },
      data: { verified: Boolean(verified) },
      include: {
        user: {
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      scout: updatedScout,
      message: `Scout ${verified ? 'verified' : 'unverified'} successfully`
    });

  } catch (error) {
    console.error('Error verifying scout:', error);
    return NextResponse.json(
      { error: 'Failed to verify scout' },
      { status: 500 }
    );
  }
});
