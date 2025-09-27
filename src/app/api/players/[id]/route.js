import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/players/[id] - Get specific player profile
export const GET = requireAuth(async (req, { params }) => {
  try {
    const playerId = params.id;
    
    // Get player profile with user details
    const player = await db.queryOne(`
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.phone,
        u.profile_pic,
        u.created_at,
        pp.player_id,
        pp.age,
        pp.height_cm,
        pp.weight_kg,
        pp.position,
        pp.preferred_foot
      FROM Users u
      JOIN PlayerProfiles pp ON u.user_id = pp.user_id
      WHERE pp.player_id = ?
    `, [playerId]);
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    // Get player stats
    const stats = await db.query(`
      SELECT 
        season,
        matches_played,
        goals,
        assists,
        minutes_played
      FROM PlayerStats
      WHERE player_id = ?
      ORDER BY season DESC
    `, [playerId]);
    
    // Get highlight videos
    const videos = await db.query(`
      SELECT 
        video_id,
        video_url,
        description,
        uploaded_at
      FROM HighlightVideos
      WHERE player_id = ?
      ORDER BY uploaded_at DESC
    `, [playerId]);
    
    // Get coach feedback
    const feedback = await db.query(`
      SELECT 
        cf.feedback_id,
        cf.rating,
        cf.notes,
        cf.feedback_date,
        u.full_name as coach_name
      FROM CoachFeedback cf
      JOIN Users u ON cf.coach_id = u.user_id
      WHERE cf.player_id = ?
      ORDER BY cf.feedback_date DESC
    `, [playerId]);
    
    return NextResponse.json({
      player,
      stats,
      videos,
      feedback
    });
    
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
});

// PUT /api/players/[id] - Update player profile
export const PUT = requireAuth(async (req, { params }) => {
  try {
    const playerId = params.id;
    const user = req.user;
    const updateData = await req.json();
    
    // Check if user owns this profile or is admin/coach
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
    
    if (player.user_id !== user.userId && !['admin', 'coach'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update player profile
    const {
      age,
      height_cm,
      weight_kg,
      position,
      preferred_foot
    } = updateData;
    
    await db.update(
      'UPDATE PlayerProfiles SET age = ?, height_cm = ?, weight_kg = ?, position = ?, preferred_foot = ? WHERE player_id = ?',
      [age, height_cm, weight_kg, position, preferred_foot, playerId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Player profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player profile' },
      { status: 500 }
    );
  }
});




