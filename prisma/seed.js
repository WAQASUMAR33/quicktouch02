const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const admin = await prisma.user.create({
    data: {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'admin'
    }
  });

  const coach = await prisma.user.create({
    data: {
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      role: 'coach'
    }
  });

  const player = await prisma.user.create({
    data: {
      full_name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1234567892',
      role: 'player'
    }
  });

  const scout = await prisma.user.create({
    data: {
      full_name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1234567893',
      role: 'scout'
    }
  });

  // Create player profile
  const playerProfile = await prisma.playerProfile.create({
    data: {
      user_id: player.user_id,
      age: 18,
      height_cm: 180,
      weight_kg: 75,
      position: 'Midfielder',
      preferred_foot: 'Right'
    }
  });

  // Create scout profile
  const scoutProfile = await prisma.scout.create({
    data: {
      user_id: scout.user_id,
      organization: 'Premier League Scouts',
      verified: true
    }
  });

  // Create sample events
  const trainingEvent = await prisma.event.create({
    data: {
      title: 'Training Session',
      type: 'training',
      event_date: new Date('2024-01-15T18:00:00Z'),
      location: 'Main Field',
      description: 'Regular training session for all players',
      created_by: coach.user_id
    }
  });

  const matchEvent = await prisma.event.create({
    data: {
      title: 'Friendly Match',
      type: 'match',
      event_date: new Date('2024-01-20T15:00:00Z'),
      location: 'Stadium',
      description: 'Friendly match against local team',
      created_by: coach.user_id
    }
  });

  // Create sample player stats
  await prisma.playerStat.create({
    data: {
      player_id: playerProfile.player_id,
      season: '2023-24',
      matches_played: 15,
      goals: 8,
      assists: 12,
      minutes_played: 1350
    }
  });

  // Create sample coach feedback
  await prisma.coachFeedback.create({
    data: {
      player_id: playerProfile.player_id,
      coach_id: coach.user_id,
      rating: 4.5,
      notes: 'Excellent performance in recent matches. Shows great potential.',
      feedback_date: new Date('2024-01-10')
    }
  });

  // Create sample highlight video
  await prisma.highlightVideo.create({
    data: {
      player_id: playerProfile.player_id,
      video_url: '/uploads/videos/sample_highlight.mp4',
      description: 'Amazing goal from last match'
    }
  });

  // Create scout favorite
  await prisma.scoutFavorite.create({
    data: {
      scout_id: scoutProfile.scout_id,
      player_id: playerProfile.player_id
    }
  });

  // Create training plan
  await prisma.trainingPlan.create({
    data: {
      coach_id: coach.user_id,
      title: 'Ball Control Drills',
      description: 'Focus on improving ball control and first touch',
      video_url: '/uploads/training/ball_control.mp4'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('Created:');
  console.log(`- ${4} users (admin, coach, player, scout)`);
  console.log(`- ${1} player profile`);
  console.log(`- ${1} scout profile`);
  console.log(`- ${2} events`);
  console.log(`- ${1} player stat record`);
  console.log(`- ${1} coach feedback`);
  console.log(`- ${1} highlight video`);
  console.log(`- ${1} scout favorite`);
  console.log(`- ${1} training plan`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





