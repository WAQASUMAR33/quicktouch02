import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
export function generateToken(user, expiresIn = '7d') {
  const payload = {
    userId: user.user_id,
    email: user.email,
    role: user.role,
    fullName: user.full_name
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user by ID
export async function getUserById(userId) {
  return await prisma.user.findUnique({
    where: { user_id: userId }
  });
}

// Get user by email
export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

// Create new user
export async function createUser(userData) {
  const { full_name, email, phone, role, academy_id, password } = userData;
  
  return await prisma.user.create({
    data: {
      full_name,
      email,
      phone,
      role,
      academy_id,
      password
    }
  });
}

// Update user
export async function updateUser(userId, userData) {
  const { full_name, email, phone, role, academy_id, profile_pic } = userData;
  
  return await prisma.user.update({
    where: { user_id: userId },
    data: {
      full_name,
      email,
      phone,
      role,
      academy_id,
      profile_pic
    }
  });
}

// Middleware for protecting routes
export function requireAuth(handler) {
  return async (req) => {
    // Support both req.headers.get() (App Router) and req.headers.authorization (Pages Router)
    const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    req.user = decoded;
    return handler(req);
  };
}

// Academy functions
export async function createAcademy(academyData) {
  const { name, description, address, phone, email, website, logo_url } = academyData;
  
  return await prisma.academy.create({
    data: {
      name,
      description,
      address,
      phone,
      email,
      website,
      logo_url
    }
  });
}

export async function getAcademyById(academyId) {
  return await prisma.academy.findUnique({
    where: { academy_id: academyId }
  });
}

export async function getAcademyByEmail(email) {
  return await prisma.academy.findUnique({
    where: { email }
  });
}

export async function getAllAcademies() {
  return await prisma.academy.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' }
  });
}

export async function updateAcademy(academyId, academyData) {
  const { name, description, address, phone, email, website, logo_url, is_active } = academyData;
  
  return await prisma.academy.update({
    where: { academy_id: academyId },
    data: {
      name,
      description,
      address,
      phone,
      email,
      website,
      logo_url,
      is_active
    }
  });
}

// Training Program functions
export async function createTrainingProgram(trainingData) {
  const { coach_id, academy_id, title, title_type, venue, program_date, program_time, details, status, video_url } = trainingData;
  
  return await prisma.trainingPlan.create({
    data: {
      coach_id,
      academy_id,
      title,
      title_type,
      venue,
      program_date,
      program_time,
      details,
      status,
      video_url
    }
  });
}

export async function getTrainingProgramById(planId) {
  return await prisma.trainingPlan.findUnique({
    where: { plan_id: planId },
    include: {
      coach: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true
        }
      }
    }
  });
}

export async function getTrainingProgramsByAcademy(academyId) {
  return await prisma.trainingPlan.findMany({
    where: { academy_id: academyId },
    include: {
      coach: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true
        }
      }
    },
    orderBy: [
      { program_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function getTrainingProgramsByCoach(coachId) {
  return await prisma.trainingPlan.findMany({
    where: { coach_id: coachId },
    include: {
      coach: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true
        }
      }
    },
    orderBy: [
      { program_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function getAllTrainingPrograms() {
  return await prisma.trainingPlan.findMany({
    include: {
      coach: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true
        }
      }
    },
    orderBy: [
      { program_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function updateTrainingProgram(planId, trainingData) {
  const { title, title_type, venue, program_date, program_time, details, status, video_url } = trainingData;
  
  return await prisma.trainingPlan.update({
    where: { plan_id: planId },
    data: {
      title,
      title_type,
      venue,
      program_date,
      program_time,
      details,
      status,
      video_url
    }
  });
}

export async function deleteTrainingProgram(planId) {
  return await prisma.trainingPlan.delete({
    where: { plan_id: planId }
  });
}

// Event functions
export async function createEvent(eventData) {
  const { title, type, event_date, event_time, location, description, status, created_by } = eventData;
  
  return await prisma.event.create({
    data: {
      title,
      type,
      event_date,
      event_time,
      location,
      description,
      status,
      created_by
    }
  });
}

export async function getEventById(eventId) {
  return await prisma.event.findUnique({
    where: { event_id: eventId },
    include: {
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    }
  });
}

export async function getAllEvents() {
  return await prisma.event.findMany({
    include: {
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: [
      { event_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function getEventsByStatus(status) {
  return await prisma.event.findMany({
    where: { status },
    include: {
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: [
      { event_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function getEventsByType(type) {
  return await prisma.event.findMany({
    where: { type },
    include: {
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: [
      { event_date: 'asc' },
      { created_at: 'desc' }
    ]
  });
}

export async function updateEvent(eventId, eventData) {
  const { title, type, event_date, event_time, location, description, status } = eventData;
  
  return await prisma.event.update({
    where: { event_id: eventId },
    data: {
      title,
      type,
      event_date,
      event_time,
      location,
      description,
      status
    }
  });
}

export async function deleteEvent(eventId) {
  return await prisma.event.delete({
    where: { event_id: eventId }
  });
}

// Player Profile functions
export async function updatePlayerProfile(playerId, profileData) {
  const { age, height_cm, position, weight_kg, preferred_foot } = profileData;
  
  return await prisma.playerProfile.update({
    where: { player_id: playerId },
    data: {
      age,
      height_cm,
      position,
      weight_kg,
      preferred_foot
    }
  });
}

export async function getPlayerProfile(playerId) {
  return await prisma.playerProfile.findUnique({
    where: { player_id: playerId },
    include: {
      user: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          phone: true,
          profile_pic: true
        }
      }
    }
  });
}

export async function getPlayerProfileByUserId(userId) {
  return await prisma.playerProfile.findUnique({
    where: { user_id: userId },
    include: {
      user: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          phone: true,
          profile_pic: true
        }
      }
    }
  });
}

// Player Reel functions
export async function createPlayerReel(reelData) {
  const { player_id, academy_id, video_url, title } = reelData;
  
  return await prisma.playerReel.create({
    data: {
      player_id,
      academy_id,
      video_url,
      title
    }
  });
}

export async function getPlayerReelById(reelId) {
  return await prisma.playerReel.findUnique({
    where: { reel_id: reelId },
    include: {
      player: {
        include: {
          user: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              profile_pic: true
            }
          }
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true,
          logo_url: true
        }
      }
    }
  });
}

export async function getPlayerReelsByPlayer(playerId) {
  return await prisma.playerReel.findMany({
    where: { player_id: playerId },
    include: {
      academy: {
        select: {
          academy_id: true,
          name: true,
          logo_url: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
}

export async function getPlayerReelsByAcademy(academyId) {
  return await prisma.playerReel.findMany({
    where: { academy_id: academyId },
    include: {
      player: {
        include: {
          user: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              profile_pic: true
            }
          }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
}

export async function getAllPlayerReels() {
  return await prisma.playerReel.findMany({
    include: {
      player: {
        include: {
          user: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              profile_pic: true
            }
          }
        }
      },
      academy: {
        select: {
          academy_id: true,
          name: true,
          logo_url: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
}

export async function updatePlayerReel(reelId, reelData) {
  const { video_url, title } = reelData;
  
  return await prisma.playerReel.update({
    where: { reel_id: reelId },
    data: {
      video_url,
      title
    }
  });
}

export async function deletePlayerReel(reelId) {
  return await prisma.playerReel.delete({
    where: { reel_id: reelId }
  });
}

// Middleware for role-based access
export function requireRole(roles) {
  return (handler) => {
    return requireAuth(async (req) => {
      if (!roles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
      return handler(req);
    });
  };
}
