import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/shop/items/[id] - Get single shop item
export const GET = requireAuth(async (req, { params }) => {
  try {
    const itemId = parseInt(params.id);

    const item = await prisma.shopItem.findUnique({
      where: { item_id: itemId }
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Shop item not found' },
        { status: 404 }
      );
    }

    // Don't show inactive items to regular users
    if (!item.is_active && req.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Shop item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });

  } catch (error) {
    console.error('Error fetching shop item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop item' },
      { status: 500 }
    );
  }
});
