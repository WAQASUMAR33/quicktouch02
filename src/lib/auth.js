import jwt from 'jsonwebtoken';
import prisma from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
export function generateToken(user) {
  const payload = {
    userId: user.user_id,
    email: user.email,
    role: user.role,
    fullName: user.full_name
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
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
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = decoded;
    return handler(req, res);
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

// Middleware for role-based access
export function requireRole(roles) {
  return (handler) => {
    return requireAuth(async (req, res) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return handler(req, res);
    });
  };
}
