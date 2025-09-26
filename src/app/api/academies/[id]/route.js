import { NextResponse } from 'next/server';
import { getAcademyById, updateAcademy } from '@/lib/auth';

// GET /api/academies/[id] - Get academy by ID
export async function GET(request, { params }) {
  try {
    const academyId = parseInt(params.id);
    
    if (isNaN(academyId)) {
      return NextResponse.json(
        { error: 'Invalid academy ID' },
        { status: 400 }
      );
    }
    
    const academy = await getAcademyById(academyId);
    
    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      academy: {
        academy_id: academy.academy_id,
        name: academy.name,
        description: academy.description,
        address: academy.address,
        phone: academy.phone,
        email: academy.email,
        website: academy.website,
        logo_url: academy.logo_url,
        is_active: academy.is_active,
        created_at: academy.created_at,
        updated_at: academy.updated_at
      }
    });
    
  } catch (error) {
    console.error('Get academy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/academies/[id] - Update academy
export async function PUT(request, { params }) {
  try {
    const academyId = parseInt(params.id);
    
    if (isNaN(academyId)) {
      return NextResponse.json(
        { error: 'Invalid academy ID' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Check if academy exists
    const existingAcademy = await getAcademyById(academyId);
    if (!existingAcademy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }
    
    const updatedAcademy = await updateAcademy(academyId, updateData);
    
    return NextResponse.json({
      success: true,
      academy: {
        academy_id: updatedAcademy.academy_id,
        name: updatedAcademy.name,
        description: updatedAcademy.description,
        address: updatedAcademy.address,
        phone: updatedAcademy.phone,
        email: updatedAcademy.email,
        website: updatedAcademy.website,
        logo_url: updatedAcademy.logo_url,
        is_active: updatedAcademy.is_active,
        created_at: updatedAcademy.created_at,
        updated_at: updatedAcademy.updated_at
      }
    });
    
  } catch (error) {
    console.error('Update academy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
