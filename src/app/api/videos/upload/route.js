import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const POST = requireAuth(async (req) => {
  try {
    const user = req.user;
    
    // Check if user is authorized to upload videos
    if (!['player', 'coach', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to upload videos' },
        { status: 403 }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get('video');
    const description = formData.get('description');
    const playerId = formData.get('playerId');
    
    if (!file || !description || !playerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify player exists and user has permission
    const player = await db.queryOne(
      'SELECT user_id FROM PlayerProfiles WHERE player_id = ?',
      [playerId]
    );
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this player profile or is admin/coach
    if (player.user_id !== user.userId && !['admin', 'coach'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to upload videos for this player' },
        { status: 403 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadsDir, { recursive: true });
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${playerId}_${Date.now()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Generate public URL
    const videoUrl = `/uploads/videos/${fileName}`;
    
    // Save video record to database
    const videoId = await db.insert(
      'INSERT INTO HighlightVideos (player_id, video_url, description) VALUES (?, ?, ?)',
      [playerId, videoUrl, description]
    );
    
    return NextResponse.json({
      success: true,
      videoId,
      videoUrl,
      message: 'Video uploaded successfully'
    });
    
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
});








