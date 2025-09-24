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
