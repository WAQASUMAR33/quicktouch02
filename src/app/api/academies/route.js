import { NextResponse } from 'next/server';
import { getAllAcademies, getAcademyById, updateAcademy } from '@/lib/auth';

// GET /api/academies - Get all academies
export async function GET(request) {
  try {
    const academies = await getAllAcademies();
    
    return NextResponse.json({
      success: true,
      academies: academies.map(academy => ({
        academy_id: academy.academy_id,
        name: academy.name,
        description: academy.description,
        address: academy.address,
        phone: academy.phone,
        email: academy.email,
        website: academy.website,
        logo_url: academy.logo_url,
        is_active: academy.is_active,
        created_at: academy.created_at
      }))
    });
    
  } catch (error) {
    console.error('Get academies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
