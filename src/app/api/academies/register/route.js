import { NextResponse } from 'next/server';
import { createAcademy, getAcademyByEmail } from '@/lib/auth';

export async function POST(request) {
  try {
    const { 
      name, 
      description, 
      address, 
      phone, 
      email, 
      website, 
      logo_url 
    } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Academy name is required' },
        { status: 400 }
      );
    }

    // Check if academy with this email already exists (if email provided)
    if (email) {
      const existingAcademy = await getAcademyByEmail(email);
      if (existingAcademy) {
        return NextResponse.json(
          { error: 'Academy with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Create academy
    const academy = await createAcademy({
      name,
      description,
      address,
      phone,
      email,
      website,
      logo_url
    });
    
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
        created_at: academy.created_at
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Academy registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
