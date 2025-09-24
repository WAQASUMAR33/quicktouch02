import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/shop/items - Get shop items
export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isActive = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (isActive !== null) {
      whereClause.is_active = isActive === 'true';
    } else {
      // By default, only show active items to regular users
      if (req.user.role !== 'admin') {
        whereClause.is_active = true;
      }
    }

    const items = await prisma.shopItem.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    // Get categories for filtering
    const categories = await prisma.shopItem.groupBy({
      by: ['category'],
      where: { 
        is_active: true,
        category: { not: null }
      }
    });

    return NextResponse.json({ 
      items,
      categories: categories.map(c => c.category).filter(Boolean)
    });

  } catch (error) {
    console.error('Error fetching shop items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop items' },
      { status: 500 }
    );
  }
});

// POST /api/shop/items - Create new shop item (admin only)
export const POST = requireRole(['admin'])(async (req) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock, 
      image_url, 
      category 
    } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Validate price
    if (parseFloat(price) < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    const item = await prisma.shopItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        image_url,
        category,
        is_active: true
      }
    });

    return NextResponse.json({
      success: true,
      item,
      message: 'Shop item created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating shop item:', error);
    return NextResponse.json(
      { error: 'Failed to create shop item' },
      { status: 500 }
    );
  }
});

// PUT /api/shop/items/[id] - Update shop item (admin only)
export const PUT = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = parseInt(searchParams.get('id'));
    const updateData = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await prisma.shopItem.findUnique({
      where: { item_id: itemId }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Shop item not found' },
        { status: 404 }
      );
    }

    // Validate price if provided
    if (updateData.price !== undefined && parseFloat(updateData.price) < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.shopItem.update({
      where: { item_id: itemId },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.price !== undefined && { price: parseFloat(updateData.price) }),
        ...(updateData.stock !== undefined && { stock: parseInt(updateData.stock) }),
        ...(updateData.image_url && { image_url: updateData.image_url }),
        ...(updateData.category && { category: updateData.category }),
        ...(updateData.is_active !== undefined && { is_active: updateData.is_active })
      }
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Shop item updated successfully'
    });

  } catch (error) {
    console.error('Error updating shop item:', error);
    return NextResponse.json(
      { error: 'Failed to update shop item' },
      { status: 500 }
    );
  }
});

// DELETE /api/shop/items/[id] - Delete shop item (admin only)
export const DELETE = requireRole(['admin'])(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = parseInt(searchParams.get('id'));

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await prisma.shopItem.findUnique({
      where: { item_id: itemId }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Shop item not found' },
        { status: 404 }
      );
    }

    await prisma.shopItem.delete({
      where: { item_id: itemId }
    });

    return NextResponse.json({
      success: true,
      message: 'Shop item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shop item:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop item' },
      { status: 500 }
    );
  }
});
