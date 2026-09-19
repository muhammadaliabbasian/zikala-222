import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../src/types.ts';

// Secret key for JWT signing
export const JWT_SECRET = process.env.JWT_SECRET || 'zikala-horology-production-jwt-token-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'admin';
    name: string;
  };
}

/**
 * Hash a plain text password using bcrypt with 10 salt rounds.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare a plain text password with a bcrypt hash.
 */
export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Generate a signed JWT token valid for 7 days.
 */
export function generateToken(user: { id: string; email: string; role: 'customer' | 'admin'; name: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  );
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Sanitize string input to prevent XSS and strip dangerous script tags.
 */
export function sanitizeString(input: string | undefined | null): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '');
}

/**
 * Deep-sanitize text fields in an object.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') return sanitizeString(obj) as any;
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as any;
  }
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

/**
 * Validate email address format.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Pakistani mobile phone format.
 */
export function validatePakistaniPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-()]/g, '');
  return /^(\+92|92|0)?3[0-9]{9}$/.test(clean);
}

/**
 * Middleware: Requires a valid JWT token.
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Valid authorization token required.',
    });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    res.status(403).json({
      success: false,
      message: 'Session token has expired or is invalid. Please sign in again.',
    });
    return;
  }

  req.user = decoded;
  next();
}

/**
 * Middleware: Requires the authenticated user to have the 'admin' role.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Administrator authorization required for this operation.',
    });
    return;
  }
  next();
}

/**
 * Middleware: Optional authentication (attaches user if valid token provided).
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      req.user = decoded;
    }
  }
  next();
}
